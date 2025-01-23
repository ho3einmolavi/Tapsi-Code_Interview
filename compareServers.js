// compareServers.js

const { Client } = require('ssh2');
const chalk = require('chalk');
const fs = require('fs')

const servers = {
    vipServers: [
        {
          name: 'VK-VIP-FI1',
          host: '65.109.192.132',
          port: 22, // Default SSH port
          username: 'root',
          privateKey: require('fs').readFileSync('C:\\Users\\PSH\\.ssh\\optinetflow'), // Path to your private key
          // password: 'your_password', // Uncomment and use if not using key-based auth
        },
        {
          name: 'VK-VIP-FI2',
          host: '65.109.202.207',
          port: 22,
          username: 'root',
          privateKey: require('fs').readFileSync('C:\\Users\\PSH\\.ssh\\optinetflow'),
        },
        {
          name: 'VK-VIP-FI3',
          host: '65.109.218.179',
          port: 22,
          username: 'root',
          privateKey: require('fs').readFileSync('C:\\Users\\PSH\\.ssh\\optinetflow'),
        },
        {
          name: 'VK-VIP-FI4',
          host: '65.109.221.79',
          port: 22,
          username: 'root',
          privateKey: require('fs').readFileSync('C:\\Users\\PSH\\.ssh\\optinetflow'),
        },
    ],
    ecoServers: [
        {
          name: 'VK-ECO-FI1',
          host: '65.109.187.92',
          port: 22, // Default SSH port
          username: 'root',
          privateKey: require('fs').readFileSync('C:\\Users\\PSH\\.ssh\\optinetflow'), // Path to your private key
          // password: 'your_password', // Uncomment and use if not using key-based auth
        },
        {
          name: 'VK-ECO-FI2',
          host: '65.109.213.85',
          port: 22,
          username: 'root',
          privateKey: require('fs').readFileSync('C:\\Users\\PSH\\.ssh\\optinetflow'),
        },
        {
          name: 'VK-ECO-FI3',
          host: '65.109.182.220',
          port: 22,
          username: 'root',
          privateKey: require('fs').readFileSync('C:\\Users\\PSH\\.ssh\\optinetflow'),
        },
    ]
}

// Function to execute a command on a server
const executeCommand = (server, command) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    let dataBuffer = '';

    conn
      .on('ready', () => {
        conn.exec(command, (err, stream) => {
          if (err) {
            conn.end();
            return reject(err);
          }
          stream
            .on('close', (code, signal) => {
              conn.end();
              resolve(dataBuffer);
            })
            .on('data', (data) => {
              dataBuffer += data.toString();
            })
            .stderr.on('data', (data) => {
              console.error(chalk.red(`STDERR: ${data}`));
            });
        });
      })
      .on('error', (err) => {
        reject(err);
      })
      .connect(server);
  });
};

// Function to collect metrics from a server
const collectMetrics = async (server) => {
  try {
    console.log(chalk.blue(`Connecting to ${server.name} (${server.host})...`));

    // Commands to retrieve metrics
    const loadAvgCmd = "uptime | awk -F'load average:' '{ print $2 }'";
    const cpuUsageCmd = "top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/'";
    const memUsageCmd = "free -m | awk '/Mem:/ { print $3, $2 }'";
    const diskUsageCmd = "df -h / | awk 'NR==2 {print $5}'";
    const netUsageCmd = "cat /sys/class/net/eth0/statistics/rx_bytes && cat /sys/class/net/eth0/statistics/tx_bytes";
    // const responseTimeCmd = "curl -o /dev/null -s -w '%{time_total}' http://localhost";
    const uptimeCmd = "uptime -p";

    // Execute commands
    const [loadAvg, cpuIdle, memInfo, diskUsage, netUsage, uptime] = await Promise.all([
      executeCommand(server, loadAvgCmd),
      executeCommand(server, cpuUsageCmd),
      executeCommand(server, memUsageCmd),
      executeCommand(server, diskUsageCmd),
      executeCommand(server, netUsageCmd),
      // executeCommand(server, responseTimeCmd),
      executeCommand(server, uptimeCmd),
    ]);

    // Parse Load Averages
    const loadAverages = loadAvg.trim().split(',').map((avg) => parseFloat(avg));

    // Parse CPU Usage
    const cpuUsage = (100 - parseFloat(cpuIdle.trim())).toFixed(2);

    // Parse Memory Usage
    const [memUsed, memTotal] = memInfo.trim().split(/\s+/).map(Number);

    // Parse Disk Usage
    const diskUsagePercent = parseFloat(diskUsage.trim().replace('%', ''));

    // Parse Network Usage (assuming eth0; adjust if different)
    const [rxBytes, txBytes] = netUsage.trim().split('\n').map(Number);
    const rxMB = (rxBytes / (1024 * 1024)).toFixed(2);
    const txMB = (txBytes / (1024 * 1024)).toFixed(2);

    // Parse Response Time
    // const responseTimeSeconds = parseFloat(responseTime.trim()).toFixed(2);

    // Parse Uptime
    const serverUptime = uptime.trim();

    return {
      server: server.name,
      host: server.host,
      loadAverages,
      cpuUsage: `${cpuUsage}%`,
      memUsed,
      memTotal,
      diskUsage: `${diskUsagePercent}%`,
      rxBytes: parseFloat(rxMB),
      txBytes: parseFloat(txMB),
      // responseTime: parseFloat(responseTimeSeconds),
      uptime: serverUptime,
    };
  } catch (error) {
    console.error(chalk.red(`Error collecting metrics from ${server.name}: ${error.message}`));
    return null;
  }
};

// Function to calculate a score for each server based on weighted metrics
const calculateScore = (metrics) => {
  const weights = {
    loadAvg1m: 0.4,       // Higher weight
    cpuUsage: 0.3,
    // responseTime: 0.2,
    memUsedRatio: 0.05,    // Ratio of used memory to total
    diskUsage: 0.05,
    network: 0.0,          // Currently not weighted
  };

  const memUsedRatio = metrics.memUsed / metrics.memTotal;

  const score =
    (metrics.loadAverages[0] * weights.loadAvg1m) +
    (parseFloat(metrics.cpuUsage) * weights.cpuUsage) +
    // (metrics.responseTime * weights.responseTime) +
    (memUsedRatio * weights.memUsedRatio) +
    (parseFloat(metrics.diskUsage) * weights.diskUsage) +
    ((metrics.rxBytes + metrics.txBytes) * weights.network); // Not contributing currently

  return score;
};

// Function to compare and select the server with the least load
const compareServers = async (key) => {
  const metricsPromises = servers[key].map((server) => collectMetrics(server));
  const metricsResults = await Promise.all(metricsPromises);

  // Filter out any failed connections
  const successfulMetrics = metricsResults.filter((result) => result !== null);

  if (successfulMetrics.length === 0) {
    console.error(chalk.red('Failed to collect metrics from all servers.'));
    return;
  }

  // Calculate scores
  successfulMetrics.forEach(metric => {
    metric.score = calculateScore(metric);
  });

  // Display metrics
  console.log(chalk.green('\n===== Server Metrics Comparison =====\n'));
  console.table(
    successfulMetrics.map((metric) => ({
      Server: metric.server,
      Host: metric.host,
      'Load Avg (1m)': metric.loadAverages[0],
      'CPU Usage': metric.cpuUsage,
      // 'Response Time (s)': metric.responseTime,
      'Memory Used (MB)': metric.memUsed,
      'Memory Total (MB)': metric.memTotal,
      'Disk Usage (%)': metric.diskUsage,
      'Network RX (MB)': metric.rxBytes,
      'Network TX (MB)': metric.txBytes,
      'Uptime': metric.uptime,
      'Score': metric.score.toFixed(2),
    })),
    [
      'Server',
      'Host',
      'Load Avg (1m)',
      'CPU Usage',
      // 'Response Time (s)',
      'Memory Used (MB)',
      'Memory Total (MB)',
      'Disk Usage (%)',
      'Network RX (MB)',
      'Network TX (MB)',
      'Uptime',
      'Score',
    ]
  );

  // Export to CSV
  const csvHeaders = [
    'Server',
    'Host',
    'Load1m',
    'Load5m',
    'Load15m',
    'CPUUsage',
    'MemUsedMB',
    'MemTotalMB',
    'DiskUsage',
    'NetRX_MB',
    'NetTX_MB',
    // 'ResponseTime_s',
    'Uptime',
    'Score',
  ];
  const csvRows = successfulMetrics.map((metric) => [
    metric.server,
    metric.host,
    metric.loadAverages[0],
    metric.loadAverages[1],
    metric.loadAverages[2],
    metric.cpuUsage,
    metric.memUsed,
    metric.memTotal,
    metric.diskUsage,
    metric.rxBytes,
    metric.txBytes,
    // metric.responseTime,
    metric.uptime.replace(',', '-'),
    metric.score.toFixed(2),
  ]);

  const csvContent = [csvHeaders, ...csvRows].map((e) => e.join(',')).join('\n');
  fs.writeFileSync('server_metrics.csv', csvContent);
  console.log(chalk.green('\nMetrics exported to server_metrics.csv'));

  // Determine the server with the lowest score
  successfulMetrics.sort((a, b) => a.score - b.score);
  const optimalServer = successfulMetrics[0];

  console.log(chalk.yellow(`\n===== Optimal ${key} =====`));
  console.log(`Server: ${optimalServer.server} (${optimalServer.host})`);
  console.log(`Load Averages (1m, 5m, 15m): ${optimalServer.loadAverages.join(', ')}`);
  console.log(`CPU Usage: ${optimalServer.cpuUsage}`);
  // console.log(`Response Time: ${optimalServer.responseTime} seconds`);
  console.log(`Memory Usage: ${optimalServer.memUsed}MB / ${optimalServer.memTotal}MB`);
  console.log(`Disk Usage: ${optimalServer.diskUsage}%`);
  console.log(`Network RX: ${optimalServer.rxBytes} MB, TX: ${optimalServer.txBytes} MB`);
  console.log(`Uptime: ${optimalServer.uptime}`);
  console.log(`Score: ${optimalServer.score.toFixed(2)}`);
};

// Execute the comparison

const main = async () => {
    const keys = Object.keys(servers)
    for await (const key of keys) {
        await compareServers(key);
    }
}


main()
