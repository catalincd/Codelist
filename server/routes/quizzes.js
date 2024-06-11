const express = require('express')
const router = express.Router()

const { JSDOM } = require('jsdom')
const dompurify = require('dompurify')

const User = require('../schemas/User')
const ConfigManager = require('../utils/ConfigManager')

const apiAuth = require('../middlewares/apiAuth')
const Quiz = require('../schemas/Quiz')
const QuizToken = require('../utils/quizzes/QuizToken')


router.post('/create', apiAuth, async (req, res) => {
    try {
        const { name, preview, steps } = req.body

        const searchedQuiz = await Quiz.findOne({ name })
        if (searchedQuiz) {
            return res.status(409).json({ error: 'QUIZ_NAME_ALREADY_USED' })
        }

        const id = await ConfigManager.GetNewQuizId()


        const cleanSteps = sanitizeSteps(steps)
        const startTime = req.body.startTime || null
        const endTime = req.body.endTime || null
        const maxTime = req.body.maxTime || null
        const maxTries = req.body.maxTries || null
        const maxScore = cleanSteps.reduce((accumulator, step) => {return accumulator + step.score}, 0)
        const password = req.body.password? (req.body.password.length > 1? req.body.password : null) : null
        const publicResults = req.body.publicResults || true
        const intro = req.body.intro? req.body.intro : ""

        const newQuiz = new Quiz({ id, name, preview, startTime, endTime, maxTime, maxTries, maxScore, password, publicResults, steps: cleanSteps, creator: req.user.username, intro})
        await newQuiz.save()

        res.status(201).json({ message: 'QUIZ_REGISTER_SUCCESS', id })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'QUIZ_SERVER_ERROR' })
    }
})

router.post('/data', apiAuth, async (req, res) => {
    try {
        if (!(req.body.id)) {
            return res.status(406).json({ error: 'ID_OR_FILTER_NOT_FOUND' })
        }

        const searchedQuiz = await Quiz.findOne({ id: req.body.id })

        if (!searchedQuiz) {
            return res.status(404).json({ error: 'QUIZ_NOT_FOUND' })
        }

        const dateNow = new Date()
        if (searchedQuiz.startTime && dateNow < searchedQuiz.startTime) {
            return res.status(200).json({ warning: 'QUIZ_DOESNT_START_YET', startTime: searchedQuiz.startTime })
        }

        // searchedQuiz.views += 1  TO DO move this to the get req ?
        //searchedQuiz.save()



        const searchedQuizObj = searchedQuiz.toObject()
        const tryData = await QuizToken.GetQuizToken(req.user, searchedQuiz)

        if(tryData.outOfTries)
            return res.status(500).json({ error: 'OUT_OF_QUIZ_TRIES' })


        const cleanedSteps = cleanupSteps(searchedQuizObj.steps).map((step, i) => {
            return { ...step, currentScore: tryData.scores ? tryData.scores[i] || 0 : 0, completed: (tryData.scores && tryData.scores[i]) ? (tryData.scores[i] == step.score) : false }
        })


        res.status(200).json({ ...searchedQuizObj, ...tryData, password: "-", steps: cleanedSteps })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'QUIZ_SERVER_ERROR' })
    }
})

router.get('/', async (req, res) => {
    try {
        if (!(req.query.id)) {
            return res.status(406).json({ error: 'ID_OR_FILTER_NOT_FOUND' })
        }

        const searchedQuiz = await Quiz.findOne({ id: req.query.id })

        if (!searchedQuiz) {
            return res.status(404).json({ error: 'QUIZ_NOT_FOUND' })
        }

        searchedQuiz.views += 1
        searchedQuiz.save()

        const searchedQuizObj = searchedQuiz.toObject()

        res.status(200).json({
            ...searchedQuizObj,
            steps: cleanupSteps(searchedQuizObj.steps),
            password: "-",
            stepsNum: searchedQuizObj.steps.length,
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'QUIZ_SERVER_ERROR' })
    }
})

router.get('/homescreen', async (req, res) => {
    try {
        var searchedQuizzes = (await Quiz.find({}).limit(5)) || []

        res.status(200).json(searchedQuizzes)
    }
    catch (error) {
        res.status(500).json({ error: 'QUIZ_SERVER_ERROR' })
    }
})

const cleanupSteps = (steps) => {
    return steps.map((step) => {
        return { ...step, tests: [] };
    })
}

const sanitizeSteps = (steps) => {

    //some more here??

    return steps.map((step) => {
        const jsdomInstance = new JSDOM("").window;
        const dompurifyInstance = dompurify(jsdomInstance);
        return { ...step, text: dompurifyInstance.sanitize(step.text) };
    })
}

module.exports = router

