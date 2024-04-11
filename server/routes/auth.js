const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const fileUpload = require('express-fileupload');
const ConfigManager = require('../utils/ConfigManager')

const JWT_KEY = fs.readFileSync('/keys/jwt_key')
const User = require('../schemas/User')
const mailer = require('../utils/accounts/mailer')
const debug = fs.readFileSync('./server/keys/debug').toString() ? true : false

router.use(fileUpload())

router.use((req, res, next) => {
    // console.log('Auth Req: ', Date.now())
    next()
})

router.post('/login', async (req, res) => {
    try {
        const { useroremail, password } = req.body

        var email = (useroremail.indexOf("@") > -1) ? useroremail : "";
        var username = (useroremail.indexOf("@") > -1) ? "" : useroremail;
        const user = await User.findOne(email == "" ? { username } : { email })

        if (!user) {
            res.status(401).json({ error: 'USER_NOT_FOUND' })
            return
        }

        if (!user.activated) {
            res.status(401).json({ error: 'USER_NOT_ACTIVATED' })
            return
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            res.status(401).json({ error: 'USER_WRONG_PASSWORD' })
            return
        }

        const token = jwt.sign({ userId: user._id }, JWT_KEY, {
            expiresIn: '12h',
        })


        res.status(200).json({ username: user.username, email: user.email, token, picture: user.picture })
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


router.post('/newpicture', async (req, res) => {
    try {
        const decoded = jwt.verify(req.body.userToken, JWT_KEY)
        const searchedUser = await User.findOne({ _id: decoded.userId })

        if(!searchedUser)
            return res.status(500).json({ error: 'USER_NOT_FOUND' })

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.')
        }

        const pictureFile = req.files.profilePicture
        const pictureName = searchedUser.username + '.' + (pictureFile.name.split('.').splice(-1))
        const picturePath = __dirname + '/../build/images/' + pictureName

        searchedUser.picture = pictureName
        await searchedUser.save()

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

router.post('/resetpicture', async (req, res) => {
    try {
        const decoded = jwt.verify(req.body.userToken, JWT_KEY)
        const searchedUser = await User.findOne({ _id: decoded.userId })
     
        if(!searchedUser)
            return res.status(500)

        searchedUser.picture = "default.png"
        await searchedUser.save()

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
            expiresIn: '12h',
        })

        res.status(201).json({ message: 'USER_ACTIVATION_SUCCESS', username: user.username, email: user.email, token: token, picture: user.picture  })
    }
    catch (error) {
        res.status(500).json({ error: 'USER_SERVER_ERROR' })
    }
})

router.post('/sendpasswordreset', async (req, res) => {
    try {
        const email = req.body.email
        const user = await User.findOne({ email })

        if (!user || !user.activated) {
            return res.status(401).json({ error: 'EMAIL_DOESNT_EXIST' })
        }

        const token = jwt.sign({ id: user._id }, JWT_KEY, {
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
            expiresIn: '12h',
        })

        res.status(201).json({ message: 'PASSWORD_RESET_SUCCESS', username: user.username, email: user.email, token: token, picture: user.picture })
    }
    catch (error) {
        res.status(500).json({ error: 'USER_SERVER_ERROR' })
    }
})




module.exports = router