const {verify} = require('jsonwebtoken')

// Essentially this function checks the token before any request (i.e. post)
const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken")

    if(!accessToken) return res.json({error: "User not logged in!"})
    try {
        const validToken = verify(accessToken, "secret")

        // Creates a new object that can be accessed outside
        req.user = validToken

        if(validToken) {
            return next()
        }
    } catch (err) {
        return res.json( {error: err} )
    }
}
module.exports = { validateToken }