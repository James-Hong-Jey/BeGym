// remember to async / await whenever u sequelize
const express = require('express')
const router = express.Router()
const { Posts, Likes } = require('../models')
const { validateToken } = require('../middlewares/AuthMiddleware')

router.get("/", validateToken, async (req,res) => {
    const postsList = await Posts.findAll({include: [Likes]})
    const likedPosts = await Likes.findAll({where: {UserId: req.user.id}})
    res.json({postsList: postsList, likedPosts: likedPosts})
})

router.get('/postID/:id', async (req,res) => {
    const id = req.params.id
    const post = await Posts.findByPk(id)
    res.json(post)
})

router.post("/", async (req,res) => {
    const post = req.body
    await Posts.create(post)
    res.json(post)
})

// only the owner of the post can delete
router.delete("/:id", validateToken, async (req,res) => {
    const postID = req.params.id
    const deletedpost = await Posts.destroy( {
        where: {
            id: postID
        }
    })
    res.json("Post Deleted")
})

module.exports = router