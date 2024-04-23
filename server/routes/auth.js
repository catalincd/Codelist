const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const fileUpload = require('express-fileupload');
const ConfigManager = require('../utils/ConfigManager')
const apiAuth = require('../middlewares/apiAuth')

const JWT_KEY = fs.readFileSync('/keys/jwt_key')

const User = require('../schemas/User')
const Problem = require('../schemas/Problem')
const Article = require('../schemas/Article')

const mailer = require('../utils/accounts/mailer')
const debug = parseInt(fs.readFileSync('./server/keys/debug').toString()) == 1

router.use(fileUpload())

router.post('/login', async (req, res) => {
    try {
        const { useroremail, password } = req.body

        var email = (useroremail.indexOf("@") > -1) ? useroremail : "";
        var username = (useroremail.indexOf("@") > -1) ? "" : useroremail;
        const user = await User.findOne(email == "" ? { username } : { email })

        if (!user) {
            res.status(406).json({ error: (email == "" ? 'USER_NOT_FOUND' : 'EMAIL_NOT_FOUND') })
            return
        }

        if (!user.activated) {
            res.status(403).json({ error: 'USER_NOT_ACTIVATED' })
            return
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            res.status(403).json({ error: 'USER_WRONG_PASSWORD' })
            return
        }

        const token = jwt.sign({ userId: user._id }, JWT_KEY, {
            expiresIn: '7d',
        })

        const userObj = user.toObject()
        res.status(200).json({ ...userObj, password: "-", token })
    }
    catch (error) {
        res.status(500).json({ error: 'USER_SERVER_ERROR' })
    }
})

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body

        const searchedUser = await User.findOne({ username })
        const searchedEmail = await User.findOne({ email })

        if (searchedUser) {
            return res.status(401).json({ error: 'USER_NAME_ALREADY_USED' })
        }

        if (searchedEmail) {
            console.log(`EMAIL: ${email}`)
            return res.status(401).json({ error: 'EMAIL_ALREADY_USED' })
        }

        const id = await ConfigManager.GetNewUserId()

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ id, username, email, password: hashedPassword, description: `Codelist user #${id}` })
        await user.save()

        const token = jwt.sign({ id: user._id }, JWT_KEY, {
            expiresIn: '1h',
        })

        if (debug)
            console.log(`Sending token:\n${token}`)
        else
            mailer.sendConfirmationEmail(username, email, token)

        res.status(201).json({ message: 'USER_REGISTER_SUCCESS' })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'USER_SERVER_ERROR' })
    }
})


router.put('/newpicture', apiAuth, async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.')
        }

        const pictureFile = req.files.profilePicture
        const pictureName = req.user.username + '.' + (pictureFile.name.split('.').splice(-1))
        const picturePath = __dirname + '/../build/images/' + pictureName

        req.user.picture = pictureName
        await req.user.save()

        pictureFile.mv(picturePath, (err) => {
            if (err)
            {
                console.log(err)
                return res.status(500).json({ error: 'USER_SERVER_ERROR' })
            }

            return res.status(200).send()
        });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'USER_SERVER_ERROR' })
    }
})

router.post('/interact', apiAuth, async (req, res) => {
    try {
        if(req.body.type == "PROBLEM_LIKE"){
            req.user.likedProblems = (req.body.action == "ADD"? [...req.user.likedProblems, req.body.id] : req.user.likedProblems.filter(_id => _id != req.body.id))
        }

        if(req.body.type == "ARTICLE_LIKE") {
            req.user.likedArticles = (req.body.action == "ADD"? [...req.user.likedArticles, req.body.id] : req.user.likedArticles.filter(_id => _id != req.body.id))
        }

        if(req.body.type == "PROBLEM_RATE") {
            const searchedProblem = await Problem.findOne({ id: req.body.id })
            if (!searchedProblem) {
                return res.status(404).json({ error: 'PROBLEM_NOT_FOUND' })
            }

            var totalRating = searchedProblem.rating * searchedProblem.ratingsCount
            var oldRating = req.user.ratedProblems.find(problem => problem.id == req.body.id)
            if(oldRating){
                searchedProblem.ratingsCount -= 1
                totalRating -= oldRating.rating
            }

            searchedProblem.ratingsCount += 1
            searchedProblem.rating = totalRating / searchedProblem.ratingsCount

            req.user.ratedProblems = [...req.user.ratedProblems.filter(problem => problem.id != req.body.id), {id:req.body.id, rating: req.body.action}]

            await req.user.save()
            await searchedProblem.save()
        }

        console.log(req.body)
        console.log(req.user)
        await req.user.save()

        return res.status(201).send()
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'USER_SERVER_ERROR' })
    }
})

router.post('/resetpicture', apiAuth, async (req, res) => {
    try {
        req.user.picture = "default.png"
        await req.user.save()

        return res.status(200).send()
    }
    catch (error) {
        console.log(error)
        res.status(500)
    }
})

router.post('/confirmation/:token', async (req, res) => {
    try {
        const { id } = jwt.verify(req.params.token, JWT_KEY);
        const user = await User.findOne({ _id: id })
        user.activated = true
        await user.save()

        const token = jwt.sign({ userId: user._id }, JWT_KEY, {
            expiresIn: '7d',
        })

        const userObj = user.toObject()
        res.status(201).json({ message: 'USER_ACTIVATION_SUCCESS', ...userObj, password: "-", token })
    }
    catch (error) {
        res.status(500).json({ error: 'USER_SERVER_ERROR' })
    }
})


router.post('/sendpasswordreset', apiAuth, async (req, res) => {
    try {
        const token = jwt.sign({ id: req.user._id }, JWT_KEY, {
            expiresIn: '1h',
        })

        if (debug)
            console.log(`Sending reset password token:\n${token}`)
        else
            mailer.sendResetPasswordEmail(user.username, email, token)

        res.status(201).json({ message: 'PASSWORD_RESET_SENT_SUCCESS' })
    }
    catch (error) {
        res.status(500).json({ error: 'USER_SERVER_ERROR' })
    }
})


router.post('/passwordreset/:token', async (req, res) => {
    try {
        const { id } = jwt.verify(req.params.token, JWT_KEY);
        const user = await User.findOne({ _id: id })

        if (!user) {
            return res.status(401).json({ error: 'USER_DOESNT_EXIST' })
        }

        user.password = await bcrypt.hash(req.body.password, 10)
        await user.save()

        const token = jwt.sign({ userId: user._id }, JWT_KEY, {
            expiresIn: '7d',
        })

        const userObj = user.toObject()
        res.status(201).json({ message: 'PASSWORD_RESET_SUCCESS', ...userObj, password: "-", token })
    }
    catch (error) {
        res.status(500).json({ error: 'USER_SERVER_ERROR' })
    }
})

router.post('/validatetoken', apiAuth, async (req, res) => {
    try {
        const userObj = req.user.toObject()
        return res.status(201).json({ message: 'VALIDATE_SUCCESS', ...userObj, password: "-", token })
    }
    catch (error) {
        res.status(500).json({ error: 'VALIDATE_ERROR' })
    }
})


module.exports = router