const jwt = require('jsonwebtoken')
const JWT_KEY = require('fs').readFileSync('/keys/jwt_key')
const User = require('../schemas/User')

const apiAuth = async (req, res, next) => {
    const token = req.header('Authorization')

    if (!token) {
        res.status(401).json({ error: 'AUTH_TOKEN_UNDEFINED' })
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_KEY)

        const searchedUser = await User.findOne({ _id: decoded.userId})
        if(!searchedUser) throw new Error("USER_NOT_FOUND_IN_DB"); 

        req.user = searchedUser
        next()
    }
    catch (error) {
        res.status(401).json({ error: 'AUTH_TOKEN_INVALID' })
    }
}

module.exports = apiAuth