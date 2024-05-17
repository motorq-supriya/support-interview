var pg = require('pg');
const async = require('async');
const fs = require('fs');
const { callbackify } = require('util');
const { rows } = require('pg/lib/defaults');
const auth = require('./auth')

var client;

async function connect(callbackHadler) {

    try {
        client = await auth();

        await client.connect();

        console.log('>>>> Connected to YugabyteDB!');

        callbackHadler();
    } catch (err) {
        callbackHadler(err);
    }
}

async function createDatabase(callbackHadler) {
    try {


        stmt = `CREATE TABLE DemoAccount (
            id int PRIMARY KEY,
            name varchar,
            age int,
            country varchar,
            balance int)`;

        await client.query(stmt);

        stmt = `INSERT INTO DemoAccount VALUES
            (1, 'Jessica', 28, 'USA', 10000),
            (2, 'John', 28, 'Canada', 9000)`;

        await client.query(stmt);

        console.log('>>>> Successfully created table DemoAccount.');

        callbackHadler();
    } catch (err) {
        callbackHadler(err);
    }
}

async function selectAccounts(callbackHadler) {
    console.log('>>>> Selecting accounts:');

    try {
        const res = await client.query('SELECT name, age, country, balance FROM DemoAccount');
        var row;

        for (i = 0; i < res.rows.length; i++) {
            row = res.rows[i];

            console.log('name = %s, age = %d, country = %s, balance = %d',
                row.name, row.age, row.country, row.balance);
        }

        callbackHadler();
    } catch (err) {
        callbackHadler(err);
    }
}

async function transferMoneyBetweenAccounts(callbackHadler, amount) {
    try {


        callbackHadler();
    } catch (err) {
        callbackHadler(err);
    }
}

async.series([
    function (callbackHadler) {
        connect(callbackHadler);
    },
    function (callbackHadler) {
        createDatabase(callbackHadler);
    },
    function (callbackHadler) {
        selectAccounts(callbackHadler);
    },
    function (callbackHadler) {
        transferMoneyBetweenAccounts(callbackHadler, 800);
    },
    function (callbackHadler) {
        selectAccounts(callbackHadler);
    }
],
    function (err) {
        if (err) {
            // Applies to logic of the transferMoneyBetweenAccounts method
            if (err.code == 40001) {
                console.error(
                    `The operation is aborted due to a concurrent transaction that is modifying the same set of rows.
                    Consider adding retry logic or using the pessimistic locking.`);
            }

            console.error(err);
        }
        client.end();
    }
);
