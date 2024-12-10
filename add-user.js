const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb://levi-stage:ihFZZ6oCO1EDqEn@188.121.101.97:27017/melkapo_core?authSource=melkapo_core';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomCapitalString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}


async function main() {
    await client.connect();

    const database = client.db('melkapo_core');
    const usersCollection = database.collection('users');
    for (let i = 0; i < 100; i++) {
        await usersCollection.insertOne(
            {

                "phoneNumber": `09${getRandomNumber(100000000, 999999999)}`,
                "authentication": {
                    "otp": null,
                    "resetPasswordToken": null,
                    "resetPasswordTokenExpiration": null,
                    "otpExpiration": null,
                    "password": "$2b$10$TNo/M3q4/Ffh3M5c90AfUeN/MCwXhQDzrYYZ6oSK.p/hFOAvPWTp2"
                },
                "verificationStatus": "referralCodeVerified",
                "referralCode": `${generateRandomCapitalString(6)}`,
                "roles": [
                    "agent",
                    "manager",
                    "operator"
                ],
                "createdAt": new Date('2023-07-13T13:39:13.746Z'),
                "updatedAt": new Date('2024-02-04T21:35:22.951Z'),
                "activityArea": {
                    "city": "Tehran",
                    "neighbourhoods": [
                        "Niavaran",
                        "Qeytarieh",
                        "Saadat Abad",
                        "Qolleh-ye Kollah",
                        "Zaferanieh"
                    ]
                },
                "fullName": `test ${i}`,
                "inviter": new ObjectId('64affe81f48a971f32c9acee'),
                "meliCardImage": "https://melkapo.s3.ir-thr-at1.arvanstorage.ir/real_estates/1b39713d-44e2-468a-b787-f21a7c9137d8.jpg",
                "profileImage": "https://melkapo.s3.ir-thr-at1.arvanstorage.ir/agents/profiles/64affe81f48a971f32c9acee/deb6ad62-8aa7-473c-b00c-c4ebaa61a0e9.jpg",
                "meliCode": "3950466230",
                "substitute": {
                    "Status": "pending",
                    "fullName": "John Doe",
                    "phoneNumber": "09123456789",
                    "relationshipType": "mother",
                    "meliCardImage": "https://melkapo.s3.ir-thr-at1.arvanstorage.ir/agents/substitute-meliCards/64affe81f48a971f32c9acee/c1356cca-a22c-4a2d-a24c-72588f992d88.jpg",
                    "meliCode": "1234567890",
                    "creditCardNumber": "1234567890123456",
                    "shebaNumber": "IR852032120321256321452365"
                },
                "creditCards": [

                ],
                "favoriteCustomers": [

                ],
                "favoriteRealEstates": [

                ]
            }
        );
    }

    console.log('done')
}

main().then(() => {
    process.exit()
})