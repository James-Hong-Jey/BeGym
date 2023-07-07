const express = require('express')
const router = express.Router()
const { Comments } = require('../models')
const { validateToken } = require('../middlewares/AuthMiddleware')

router.get('/:PostId', async (req,res) => {
    const PostId = req.params.PostId
    const comments = await Comments.findAll({
        // return every row that matches:
        where: {
            PostId: PostId
        }
    })
    res.json(comments)
})


// router.delete("/comments/:id", async (req,res) => {
    // const commentId = req.params.id

    // try {
        // const deletedComment = await Comments.destroy( {
            // where: {
                // id: commentId
            // }
        // })
    // }
// })

router.post("/", validateToken, async (req,res) => {
    const comment = req.body
    const username = req.user.username
    comment.username = username
    await Comments.create(comment)
    res.json(comment);
})

module.exports = router