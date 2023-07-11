const express = require('express')
const router = express.Router()
const { Likes } = require('../models')
const { validateToken } = require('../middlewares/AuthMiddleware')

router.post("/", validateToken, async(req,res) => {
    const { PostId } = req.body
    const UserId = req.user.id

    // Users cannot like more than once 
    const found = await Likes.findOne({where: {PostId: PostId, UserId: UserId}})
    if(!found){
        await Likes.create({ PostId: PostId, UserId: UserId})
        res.json({liked: true})
    } else {
        // Unlike 
        await Likes.destroy({
            where: { PostId: PostId, UserId: UserId}
        })
        res.json({liked: false})
    }
})

module.exports = router