var pg = require('pg');
require('dotenv').config()

const config = {
    host: 'us-east-1.15fe53b5-0959-43f5-b933-48c78206e8fc.aws.ybdb.io',
    port: '5433',
    database: 'yugabyte',
    user: 'admin',
    password: '',
    connectionTimeoutMillis: 5000000,
    sslmode: 'require',
    ssl: 'true'
};


async function auth() {
    console.log('>>>> Connecting to YugabyteDB!');

    try {
        client = new pg.Client(config);
        //console.log(process.env.password)
        return client;
    } catch (err) {
        throw err
    }
}

module.exports = auth;