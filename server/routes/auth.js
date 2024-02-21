const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_KEY = require('fs').readFileSync('/keys/jwt_key')
const User = require('../schemas/User')

router.use((req, res, next) => {
    console.log('Auth Req: ', Date.now())
    next()
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username })
        if (!user) {
            res.status(401).json({ error: 'USER_NOT_FOUND' })
            return
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            res.status(401).json({ error: 'USER_WRONG_PASSWORD' })
            return
        }

        const token = jwt.sign({ userId: user._id }, JWT_KEY, {
            expiresIn: '1h',
        })

        res.status(200).json({ token })
    }
    catch (error) {
        res.status(500).json({ error: 'USER_SERVER_ERROR' })
    }
})

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body

        const searchedUser = await User.findOne({ username })
        if (searchedUser) {
            return res.status(401).json({ error: 'USER_NAME_ALREADY_USED' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ username, password: hashedPassword })
        await user.save()

        res.status(201).json({ message: 'USER_REGISTER_SUCCESS' })
    }
    catch (error) {
        res.status(500).json({ error: 'USER_SERVER_ERROR' })
    }
})


module.exports = router