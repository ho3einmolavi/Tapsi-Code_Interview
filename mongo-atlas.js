const fetch = require('node-fetch');
const crypto = require('crypto');

const config = {
  publicKey: 'dnxulsbc',
  privateKey: 'a50e12c2-990b-40e4-86cd-2dfb693b4fb0',
  projectId: '67dbf89c5267eb02f32f4cb1',
  clusterName: 'Cluster0',
  baseUrl: 'https://cloud.mongodb.com/api/atlas/v2',
};

const indexPayload = {
  collectionName: 'User',
  database: 'dentment',
  name: 'userSearch1',
  type: 'search',
  definition: {
    mappings: {
      dynamic: false,
      fields: {
        firstName: { type: 'autocomplete' },
        lastName: { type: 'autocomplete' },
        middleName: { type: 'autocomplete' },
        suffix: { type: 'autocomplete' },
      },
    },
  },
};

function md5(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

function parseDigest(header) {
  const parts = {};
  const regex = /(\w+)=["]?([^",]+)["]?/g;
  let match;
  while ((match = regex.exec(header)) !== null) {
    parts[match[1]] = match[2];
  }
  return parts;
}

async function createSearchIndex() {
  const url = `${config.baseUrl}/groups/${config.projectId}/clusters/${config.clusterName}/search/indexes`;
  const method = 'POST';
  const uri = new URL(url).pathname;

  // Step 1: Send unauthenticated request to get digest challenge
  const initRes = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.atlas.2024-05-30+json',
    },
    body: JSON.stringify(indexPayload),
  });

  if (initRes.status !== 401) {
    console.error('Expected 401, got:', initRes.status);
    process.exit(1);
  }

  const wwwAuth = initRes.headers.get('www-authenticate');
  if (!wwwAuth) {
    throw new Error('No WWW-Authenticate header received');
  }

  // Step 2: Parse digest challenge
  const digest = parseDigest(wwwAuth);
  const cnonce = crypto.randomBytes(8).toString('hex');
  const nc = '00000001';
  const qop = 'auth';

  const ha1 = md5(`${config.publicKey}:${digest.realm}:${config.privateKey}`);
  const ha2 = md5(`${method}:${uri}`);
  const responseDigest = md5(`${ha1}:${digest.nonce}:${nc}:${cnonce}:${qop}:${ha2}`);

  const authHeader = `Digest username="${config.publicKey}", realm="${digest.realm}", nonce="${digest.nonce}", uri="${uri}", response="${responseDigest}", algorithm=MD5, qop=${qop}, nc=${nc}, cnonce="${cnonce}"`;

  // Step 3: Send authenticated request
  const finalRes = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.atlas.2024-05-30+json',
      'Authorization': authHeader,
    },
    body: JSON.stringify(indexPayload),
  });

  const result = await finalRes.text();

  if (!finalRes.ok) {
    console.error(`❌ Failed: ${finalRes.status}`);
    console.error(result);
    process.exit(1);
  }

  console.log('✅ Index created successfully:');
  console.log(result);
}

createSearchIndex().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
