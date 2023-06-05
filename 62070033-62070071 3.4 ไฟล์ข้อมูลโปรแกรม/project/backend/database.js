const mysql = require('mysql2/promise');
const dbconnection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mydb"
})

module.exports = dbconnection