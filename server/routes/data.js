const express = require('express')
const router = express.Router()

const User = require('../schemas/User')
const Problem = require('../schemas/Problem')
const Article = require('../schemas/Article')

const apiAuth = require('../middlewares/apiAuth')

router.use((req, res, next) => {
    // console.log('Data Req: ', Date.now())
    next()
})

router.get('/user/:username/', async (req, res) => {
    if(!(req.params.username)){
        return res.status(406).json({ error: 'USERNAME_REQUIRED' })
    }
    const user = await User.findOne({ username: req.params.username })
    if (!user) {
        return res.status(401).json({ error: 'USER_NOT_FOUND' })
    }
    const userObj = user.toObject()
    res.status(200).json(userObj)
})


router.get('/user/full/:username/', async (req, res) => {
    if(!(req.params.username)){
        return res.status(406).json({ error: 'USERNAME_REQUIRED' })
    }
    const user = await User.findOne({ username: req.params.username })
    if (!user) {
        return res.status(401).json({ error: 'USER_NOT_FOUND' })
    }
    const userObj = user.toObject()
    
    const readArticles = await Problem.find({id: { $in: user.readArticles}})
    const solvedProblems = await Problem.find({id: { $in: user.solvedProblems}})
    const uploadedArticles = await Problem.find({id: { $in: user.uploadedArticles}})
    const uploadedProblems = await Problem.find({id: { $in: user.uploadedProblems}})
    const likedArticles = await Problem.find({id: { $in: user.likedArticles}})
    const likedProblems = await Problem.find({id: { $in: user.likedProblems}})
    
    res.status(200).json({
        ...userObj,
        password: "-",
        readArticles,
        solvedProblems,
        uploadedArticles,
        uploadedProblems,
        likedArticles,
        likedProblems
    })
})

module.exports = router