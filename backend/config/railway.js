require("dotenv").config
const mysql = require("mysql2")

const ur1DB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`


const connection = mysql.createConnection(ur1DB)
module.exports = connection