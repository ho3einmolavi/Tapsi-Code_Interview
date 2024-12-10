const { Redis } = require('ioredis');
const { MongoClient } = require('mongodb');

// Redis connection settings
const redisClient = new Redis({
    host: 'localhost', // Update with your Redis server details
    port: 6379,         // Update with your Redis server port
});

// MongoDB connection settings
const mongoURI = 'mongodb://levi-stage:ihFZZ6oCO1EDqEn@188.121.101.97:27017/?authSource=melkapo_core'; // Update with your MongoDB server URI
const dbName = 'melkapo_core';    

async function main() {
    try {
        // Connect to MongoDB
        const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        
        // Create collections
        const agenciesCollection = db.collection('divar_agencies');
        const agentsCollection = db.collection('divar_agents');

        // Get all Redis keys and sets
        const keySets = await getRedisKeySets();

        await saveDataInMongoDB(agenciesCollection, agentsCollection, keySets);

        console.log('Data successfully saved in MongoDB.');

        // Close connections
        await closeConnections(client);
    } catch (error) {
        console.error('Error:', error);
    }
}


async function getRedisKeySets() {
    return new Promise((resolve, reject) => {
        redisClient.keys('*', async (err, keys) => {
            if (err) {
                reject(err);
            } else {
                const keySets = await Promise.all(keys.map(async (key) => {
                    const setMembers = await getRedisSetMembers(key);
                    return { key, setMembers };
                }));
                resolve(keySets);
            }
        });
    });
}

async function getRedisSetMembers(key) {
    return new Promise((resolve, reject) => {
        redisClient.smembers(key, (err, members) => {
            if (err) {
                reject(err);
            } else {
                resolve(members);
            }
        });
    });
}

async function saveDataInMongoDB(agenciesCollection, agentsCollection, keySets) {
    const promises = keySets.map(async ({ key, setMembers }) => {
        const [prefix, area, agency_divar_id] = key.split(':');

        // Update agenciesCollection with area
        await agenciesCollection.updateOne({ agency_divar_id }, { $set: { area } }, { upsert: true });

        // Save setMembers in agentsCollection
        const setMembersPromises = setMembers.map(async (member) => {
            return agentsCollection.updateOne(
                { agent_divar_id: member },
                { $set: {agency_divar_id} },
                { upsert: true }
            );
        });

        await Promise.all(setMembersPromises);
    });

    return Promise.all(promises);
}


async function closeConnections(client) {
    await redisClient.quit();
    await client.close();
}

// Run the main function
main();