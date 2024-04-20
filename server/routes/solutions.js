const express = require('express')
const router = express.Router()

const RunnerManager = require('../utils/RunnerManager')
const ConfigManager = require('../utils/ConfigManager')

const apiAuth = require('../middlewares/apiAuth')
const Solution = require('../schemas/Solution')

router.use((req, res, next) => {
    // console.log('Data Req: ', Date.now())
    next()
})

router.post('/send', apiAuth, async (req, res) => {
    
    console.log("Received solution")
    console.log(req.body.language)
    console.log(req.body.code)

    try {
        const { problemId, code, language } = req.body

        const { time, memory, error, tests, output } = await RunnerManager.Problem()

        const id = await ConfigManager.GetNewSolutionId()
        const solution = new Solution({ id, problemId, username: req.user.username, code, time, memory, error, tests, output })
        await solution.save()

        res.status(201).json(solution)
    }
    catch (error) {
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

        const searchedSolutions = await Solution.find({ username })

        res.status(200).json(searchedSolutions? searchedSolutions : [])
    }
    catch (error) {
        res.status(500).json({ error: 'PROBLEM_SERVER_ERROR' })
    }
})


module.exports = router