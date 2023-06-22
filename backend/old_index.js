// TO DO: clean up everything with sequelize
const express = require("express");
const mysql = require("mysql");
const cors = require("cors"); // cross platform (i.e. front to back)

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "users",
})

// Routers
const postRouter = require('./routes/posts')
app.use("/posts", postRouter)

app.listen(8080, () => {
    console.log("Connected to Backend!")
})

//     ALTER USER 'root'@'localhost' IDENTIFIED with mysql_native_password by 'password'


app.post('/register', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "INSERT INTO users.login (username, password) VALUES (?,?)",
        [username, password],
        (err, result) => { console.log(err) }
    )
})

app.post('/login', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users.login WHERE username = ? AND password = ?",
        [username, password],
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0){
                res.send({ username: result.username });
            } else {
                res.send({ message: "Wrong Username or Password!" });
            }
        }
    )
})

app.get("/", (req, res) => {
    res.json("Hello, this is the backend!")
})

db.on('connect', () => {
    console.log('MySQL database connected.');
});

db.on('error', (err) => {
    console.error('Error occurred while connecting to MySQL database:', err);
});

