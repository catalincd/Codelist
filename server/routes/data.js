const express = require('express')
const router = express.Router()

const User = require('../schemas/User')

const jwtDecoder = require('../middlewares/jwtDecoder')

router.use((req, res, next) => {
    console.log('Data Req: ', Date.now())
    next()
})

router.post('/user', async (req, res) => {
    const { username } = req.body

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ error: 'USER_NOT_FOUND' })
        }

        

        res.status(201).json(user)
})


module.exports = router