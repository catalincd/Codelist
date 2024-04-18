const express = require('express')
const router = express.Router()

const User = require('../schemas/User')

const apiAuth = require('../middlewares/apiAuth')

router.use((req, res, next) => {
    // console.log('Data Req: ', Date.now())
    next()
})

router.get('/user', async (req, res) => {
    if(!(req.query.username)){
        return res.status(406).json({ error: 'USERNAME_REQUIRED' })
    }

    const user = await User.findOne({ username: req.query.username })
    if (!user) {
        return res.status(401).json({ error: 'USER_NOT_FOUND' })
    }

    const solvedProblems = [{
        id: 1,
        name: "Factorial",
        rating: 3.5,
        solved: true
    },
    {
        id: 2,
        name: "Problemm",
        rating: 4,
        solved: false
    },
    {
        id: 3,
        name: "FactorialX",
        rating: 3.5,
        solved: null
    }]

    const uploadedProblems = [{
        id: 4,
        name: "NSUM",
        views: 576,
    },
    {
        id: 5,
        name: "Problemm5",
        views: 400,
    },
    {
        id: 6,
        name: "Fibo16",
        views: 100,
    }]

    res.status(200).json({
        picture: user.picture,
        username: user.username,
        created: user.createdAt,
        description: user.description,
        solvedProblems,
        uploadedProblems
    })
})


module.exports = router