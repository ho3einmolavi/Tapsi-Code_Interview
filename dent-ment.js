const express = require('express');

const app = express();
const port = 3000;
const ipLimitsMap = new Map() // value => {requestCount: 0, initiateTime: Date, lastRequestTime: Date}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    console.log({ip})
    // block if request count is more than 5 in 1 minutes time range
    console.log({ipLimitsMap})
    if(ipLimitsMap.has(ip)) {
        const requestObj = ipLimitsMap.get(ip)
        const timeDiff = requestObj.lastRequestTime - requestObj.initiateTime
        console.log(timeDiff)

        if(timeDiff > 30000) {
            ipLimitsMap.set(ip, {requestCount: 1, initiateTime: new Date(), lastRequestTime: new Date()})
        } else {
            if(requestObj.requestCount > 5) {
                res.status(428).send('too many requests');
            } else {
                ipLimitsMap.set(ip, {requestCount: requestObj.requestCount + 1, initiateTime: requestObj.initiateTime, lastRequestTime: new Date()})
            }
        }
        
    } else {
        ipLimitsMap.set(ip, {requestCount: 1, initiateTime: new Date(), lastRequestTime: new Date()})
    }
    next();
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    // ...
    res.send('User created successfully');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});