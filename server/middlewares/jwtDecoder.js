const jwt = require('jsonwebtoken')
const JWT_KEY = require('fs').readFileSync('/keys/jwt_key')

const jwtDecoder = (req, res, next) => {
    const token = req.header('Authorization')

    if (!token) {
        res.status(401).json({ error: 'AUTH_DENIED' })
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_KEY)
        req.userId = decoded.userId
        next()
    }
    catch (error) {
        res.status(401).json({ error: 'AUTH_TOKEN_INVALID' })
    }
}

module.exports = jwtDecoder