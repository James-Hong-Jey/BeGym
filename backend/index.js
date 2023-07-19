const express = require("express");
const app = express();
// const mysql = require("mysql");
const cors = require("cors"); // cross platform (i.e. front to back)
app.use(express.json());
app.use(cors());
// require('dotenv').config( {path: path.join(__ditname, '../','./env')})

const db = require("./models");

// Routers
const postRouter = require('./routes/posts')
app.use("/posts", postRouter)
const commentRouter = require('./routes/comments')
app.use("/comments", commentRouter)
const userRouter = require('./routes/users')
app.use("/auth", userRouter)
const likesRouter = require('./routes/likes')
app.use("/likes", likesRouter)

db.sequelize.sync().then(()=>{
    app.listen(8080, ()=> {
        console.log("Backend Running!")
    })
})
.catch((err) => {
    console.log(err)
})

app.get("/", (req, res) => {
    res.json("Hello, this is the backend!")
})