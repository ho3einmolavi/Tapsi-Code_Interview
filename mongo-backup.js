const { MongoTransferer, MongoDBDuplexConnector, LocalFileSystemDuplexConnector } = require('mongodb-snapshot')

async function dumpMongo2Localfile() {
    const mongo_connector = new MongoDBDuplexConnector({
        connection: {
            uri: `mongodb://ho3einmolaviRoot:QhXXguGRjjSQKp2@188.121.101.97:27017/`,
            dbname: 'melkapo_core',
        },
    });

    const localfile_connector = new LocalFileSystemDuplexConnector({
        connection: {
            path: './backup.tar',
        },
    });

    const transferer = new MongoTransferer({
        source: mongo_connector,
        targets: [localfile_connector],
    });

    for await (const { total, write } of transferer) {
        console.log(`remaining bytes to write: ${total - write}`);
    }
}

async function restoreLocalfile2Mongo() {
    const mongo_connector = new MongoDBDuplexConnector({
        connection: {
            uri: `mongodb://ho3einmolaviRoot:QhXXguGRjjSQKp2@188.121.101.97:27017/`,
            dbname: 'melkapo_core_production',
        },
    });

    const localfile_connector = new LocalFileSystemDuplexConnector({
        connection: {
            path: './mongo_backup_backup_2024-12-08.tar',
        },
    });

    const transferer = new MongoTransferer({
        source: localfile_connector,
        targets: [mongo_connector],
    });

    for await (const { total, write } of transferer) {
        console.log(`remaining bytes to write: ${total - write}`);
    }
}

// dumpMongo2Localfile()
// restoreLocalfile2Mongo()