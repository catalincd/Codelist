const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const JWT_KEY = fs.readFileSync('/keys/jwt_key')
const User = require('../schemas/User')
const mailer = require('../utils/accounts/mailer')
const debug = parseInt(fs.readFileSync('./server/keys/debug').toString()) == 1 || false

router.use((req, res, next) => {
    // console.log('Auth Req: ', Date.now())
    next()
})

router.post('/login', async (req, res) => {
    try {
        const { useroremail, password } = req.body

        var email = (useroremail.indexOf("@") > -1)? useroremail : "";
        var username = (useroremail.indexOf("@") > -1)? "" : useroremail;
        const user = await User.findOne(email == ""? { username } : { email })

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

        email = user.email;
        username = user.username;
        res.status(200).json({ username, email, token })
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

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ username, email, password: hashedPassword })
        await user.save()

        const token = jwt.sign({ id: user._id }, JWT_KEY, {
            expiresIn: '1h',
        })

        
        if(debug)
            console.log(`Sending token:\n${token}`)
        else
            mailer.sendConfirmationEmail(username, email, token)

        res.status(201).json({ message: 'USER_REGISTER_SUCCESS'})
        
    }
    catch (error) {
        res.status(500).json({ error: 'USER_SERVER_ERROR' })
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

        res.status(201).json({ message: 'USER_ACTIVATION_SUCCESS', username: user.username, email: user.email, token: token })
    }
    catch (error) {
        res.status(500).json({ error: 'USER_SERVER_ERROR' })
    }
})

router.post('/sendpasswordreset', async (req, res) => {
    try {
        const email = req.body.email
        const user = await User.findOne({ email })
        
        if(!user || !user.activated){
            return res.status(401).json({ error: 'EMAIL_DOESNT_EXIST' })
        }

        const token = jwt.sign({ id: user._id }, JWT_KEY, {
            expiresIn: '1h',
        })

        
        if(debug)
            console.log(`Sending reset password token:\n${token}`)
        else
            mailer.sendResetPasswordEmail(user.username, email, token)

        res.status(201).json({ message: 'PASSWORD_RESET_SENT_SUCCESS'})
    }
    catch (error) {
        res.status(500).json({ error: 'USER_SERVER_ERROR' })
    }
})

router.post('/passwordreset/:token', async (req, res) => {
    try {
        const { id } = jwt.verify(req.params.token, JWT_KEY);
        const user = await User.findOne({ _id: id })
        
        if(!user){
            return res.status(401).json({ error: 'USER_DOESNT_EXIST' })
        }

        user.password = await bcrypt.hash(req.body.password, 10)
        await user.save()

        const token = jwt.sign({ userId: user._id }, JWT_KEY, {
            expiresIn: '12h',
        })

        res.status(201).json({ message: 'PASSWORD_RESET_SUCCESS', username: user.username, email: user.email, token: token })
    }
    catch (error) {
        res.status(500).json({ error: 'USER_SERVER_ERROR' })
    }
})




module.exports = router