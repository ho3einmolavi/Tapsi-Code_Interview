const axios = require('axios');
const { MongoClient, ObjectId } = require('mongodb');
const { Parser } = require('json2csv');
const fs = require('fs');
// MongoDB connection string
const uri = 'mongodb://amir:Y%3By*%5DFm%40pH_@94.101.184.187:27017/';

// Function to fetch user data from MongoDB by userId
const fetchUserDataFromDB = async (userId, client) => {
    try {
        const database = client.db('melkapo_core');
        const usersCollection = database.collection('users');

        // Query the database for the user's data
        const userData = await usersCollection.findOne({ _id: new ObjectId(userId) });
        
        if (userData) {
            console.log(`User data for ${userId}:`, userData);
            return userData
        } else {
            console.log(`No user found with userId: ${userId}`);
            return null
        }
    } catch (error) {
        console.error(`Error fetching user data for ${userId}:`, error.message);
    }
};

// Function to fetch userIds from API
const fetchUserIds = async (levelNumber, client) => {
    try {
        const response = await axios.get(`https://levi.melkapo.com/api/v1/agent/network/level-members/${levelNumber}`, {
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWM4MWVkODEwOTJjMzI4OTRhNDIwNmQiLCJpYXQiOjE3MzE3NTQ2NTUsImV4cCI6MTczMTc1ODI1NX0.h9aWnYexzHXATzjWSzTR8ZfMTHvF09yl-94DRegn7q0'
            }
        });

        // Check if the response is successful
        if (response.status === 200 && response.data.status === 200) {
            const members = response.data.payload.members;

            // Map all userId values
            const userIds = members.map(member => member.userId);
            console.log({ levelNumber });
            console.log(userIds);

            // Fetch user data for each userId from MongoDB
            const res = []
            for (const userId of userIds) {
                const user = await fetchUserDataFromDB(userId, client);
                res.push({id: userId, phone: user.phoneNumber, fullName: user.fullName, activityArea: user.activityArea.neighbourhoods.join(' - ').trim(), inviter: user.inviter, levelNumber})
            }   
            return res
        } else {
            console.error('Failed to fetch members:', response.data.message);
        }
    } catch (error) {
        console.error('Error fetching user IDs:', error.message);
    }
};

const convertToCSV = (result) => {
    try {
        const fields = ['id', 'phone', 'fullName', 'activityArea', 'inviter', 'levelNumber'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(result);

        // Write CSV to a file
        fs.writeFileSync('users.csv', csv);
        console.log('CSV file has been saved as users.csv');
    } catch (error) {
        console.error('Error converting to CSV:', error.message);
    }
};

async function main() {
    // Create a MongoDB client
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB server
        await client.connect();
        let result = []
        // Loop through levels and fetch userIds
        for (let i = 1; i < 11; i++) {
            const users = await fetchUserIds(i, client);
            result = [...result, ...users]
        }
        convertToCSV(result)
    } catch (error) {
        console.error('Error in main function:', error.message);
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
}

main();
