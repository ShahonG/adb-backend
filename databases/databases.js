/*
const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
    'neo4j://localhost',
    neo4j.auth.basic('neo4j', 'password')
)
*/

const { Client } = require('pg')
const pgClient = new Client({
    user: "kneskung",
    host: "localhost",
    database: "taiwan_map",
    password: "",
    port: "5432",
});

pgClient.connect() 

module.exports = {
    // 'neoDriver': 'driver',
    'pgClient': pgClient,
}
