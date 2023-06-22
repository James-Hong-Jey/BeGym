const express = require("express");
const app = express();
// const mysql = require("mysql");
const cors = require("cors"); // cross platform (i.e. front to back)
app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
const postRouter = require('./routes/posts')
app.use("/posts", postRouter)

db.sequelize.sync().then(()=>{
    app.listen(8080, ()=> {
        console.log("Backend Running!")
    })
})

app.get("/", (req, res) => {
    res.json("Hello, this is the backend!")
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
