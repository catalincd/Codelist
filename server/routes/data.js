const express = require('express')
const router = express.Router()

const User = require('../schemas/User')

const jwtDecoder = require('../middlewares/jwtDecoder')

router.use((req, res, next) => {
    console.log('Data Req: ', Date.now())
    next()
})

router.post('/user', jwtDecoder, async (req, res) => {
    const { username } = req.body

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ error: 'USER_NOT_FOUND' })
        }

        // filter out password here

        res.status(200).json(user)
})


module.exports = router