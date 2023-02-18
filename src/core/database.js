const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    port: process.env.PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
});

module.exports = pool;