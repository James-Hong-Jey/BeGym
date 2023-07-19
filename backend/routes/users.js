// TODO: port existing login to bauth system
const express = require('express')
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require("bcrypt")
const { validateToken } = require("../middlewares/AuthMiddleware")

const {sign} = require('jsonwebtoken')

router.post("/", async (req,res) => {
    const {username, password} = req.body
    const checkExistingUser = await Users.findOne({where: {username: username}})
    if(checkExistingUser) return res.json({error: "Username Taken."});

    bcrypt.hash(password, 10).then( (hash) => {
        Users.create( {
            username: username,
            password: hash,
        })
        res.json("Registration Success")
    })
})

router.post("/login", async(req,res) => {
    const { username, password } = req.body

    const user = await Users.findOne({ where: {username: username}})

    if(!user) return res.json({error: "User doesn't exist."})

    bcrypt.compare(password, user.password).then( (match) => {
        if(!match) return res.json({error: "Wrong Password!"})

        const accessToken = sign({ username: user.username, id: user.id }, "secret")
        // return res.json("Successful Login")
        // return res.json(accessToken)
        res.json({
            token: accessToken,
            username: username,
            id: user.id
        })
    })
})


router.get('/auth', validateToken, (req,res) => {
    res.json(req.user)
})

module.exports = router