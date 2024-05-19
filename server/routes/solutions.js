const express = require('express')
const router = express.Router()

const RunnerManager = require('../utils/RunnerManager')
const ConfigManager = require('../utils/ConfigManager')

const apiAuth = require('../middlewares/apiAuth')

const User = require('../schemas/User')
const Problem = require('../schemas/Problem')
const Quiz = require('../schemas/Quiz')
const Solution = require('../schemas/Solution')
const QuizSolution = require('../schemas/QuizSolution')
const { ValidateUserToken } = require('../utils/accounts/QuizToken')

router.use((req, res, next) => {
    // console.log('Data Req: ', Date.now())
    next()
})


router.post('/sendquiz', apiAuth, async (req, res) => {
    try {

    const { quizId, stepId, source, language, token, solutionId } = req.body

    const searchedQuiz = await Quiz.findOne({ id: quizId })
    const searchedSolution = await QuizSolution.findOne({ _id: solutionId })

    if (!searchedQuiz || !searchedSolution) {
        return res.status(404).json({ error: 'DATA_NOT_FOUND' })
    }

    const validation = await ValidateUserToken(req.user, searchedQuiz.toObject(), token)

    if(!validation) {
        return res.status(403).json({ error: 'TOKEN_VERIFICATION_FAILED' })
    }

    const quizObj = searchedQuiz.toObject()
    const quizFiles = quizObj.steps[stepId].files
    const quizTests = quizObj.steps[stepId].tests

    const { reqError, error, stdout, stderr, memory, time, tests} = await RunnerManager.Problem(source, language, req.user.username, quizFiles, quizTests)

    if(reqError) throw new Error(reqError)
    

    const newScore = error? 0:Math.round(quizObj.steps[stepId].score * (tests.filter(test => test).length / tests.length))
    const solutionStep = searchedSolution.steps? (searchedSolution.steps[stepId] || {}) : {}


    if(solutionStep.score && solutionStep.score > newScore)
    {
        return res.status(201).json({ stepId, score: newScore, time, memory, error, tests, stdout, stderr, createdAt: new Date()})
    }

    var newSteps = searchedSolution.steps? searchedSolution.steps : []
    newSteps[stepId] = {score: newScore, source, error, stdout, stderr, memory, time, tests}
    searchedSolution.steps = newSteps
    
    
    var totalScore = 0
    for(var i=0;i<searchedSolution.steps.length;i++) totalScore += searchedSolution.steps[i]? searchedSolution.steps[i].score || 0 : 0
    
    searchedSolution.score = totalScore
    await searchedSolution.save()

    


    return res.status(201).json({ stepId, score: newScore, totalScore, time, memory, error, tests, stdout, stderr, createdAt: new Date()})
}
catch (error) {
    console.log(error)
    res.status(500).json({ error: 'SOLUTION_SERVER_ERROR' })
}
})

router.post('/send', apiAuth, async (req, res) => {
        try {
        const { problemId, source, language } = req.body

        const searchedProblem = await Problem.findOne({ id: problemId })

        if (!searchedProblem) {
            return res.status(404).json({ error: 'PROBLEM_NOT_FOUND' })
        }

        const probObj = searchedProblem.toObject()

        const { reqError, error, stdout, stderr, memory, time, tests} = await RunnerManager.Problem(source, language, req.user.username, probObj.files, probObj.tests)

        if(reqError) throw new Error(reqError)  /// ???? why

        const id = await ConfigManager.GetNewSolutionId()
        const solution = new Solution({ id, problemId, username: req.user.username, time, memory, error, tests })
        await solution.save()

        res.status(201).json({...solution.toObject(), stdout, stderr})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'SOLUTION_SERVER_ERROR' })
    }
})

router.put('/run', apiAuth, async (req, res) => {
    
    console.log("Received run request")
    console.log(req.body.language)
    console.log(req.body.source)

    try {
        //username: req.user.username
        
        const { source, language } = req.body

        console.log(source)

        const runResults = await RunnerManager.Code(source, language, req.user.username)

        res.status(201).json(runResults)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'SOLUTION_SERVER_ERROR' })
    }
})

router.get('/getUserSolutions', async (req, res) => {
    try {
        const username = req.body.username || req.query.username

        const searchedSolutions = await Solution.find({ username }) ///// filter these per problem....

        res.status(200).json(searchedSolutions? searchedSolutions : [])
    }
    catch (error) {
        res.status(500).json({ error: 'PROBLEM_SERVER_ERROR' })
    }
})


module.exports = router