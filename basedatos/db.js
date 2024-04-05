const pg = require('pg');
const fs = require('fs')
const path = require('path');

const pool = new pg.Pool({
    user: "postgres",
    host: "localhost", 
    database: "postgres", 
    password: "my-secret-pw", 
    port: 5437
});

module.exports = pool;