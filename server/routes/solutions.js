const express = require('express')
const router = express.Router()

const ConfigManager = require('../utils/ConfigManager')
const CodeRunner = require('../utils/CodeRunner')

const jwtDecoder = require('../middlewares/jwtDecoder')
const Solution = require('../schemas/Solution')

router.use((req, res, next) => {
    // console.log('Data Req: ', Date.now())
    next()
})

router.post('/send', jwtDecoder, async (req, res) => {
    
    console.log("Received solution")
    console.log(req.body.language)
    console.log(req.body.code)


    const { problemId, username, code, language } = req.body

        const { time, memory, error, tests, output } = await CodeRunner.RunSolutionCode(problemId, code, language)

        const id = await ConfigManager.GetNewSolutionId()
        const solution = new Solution({ id, problemId, username, code, time, memory, error, tests, output })
        await solution.save()

        res.status(201).json(solution)
        return

    try {
        
    }
    catch (error) {
        res.status(500).json({ error: 'SOLUTION_SERVER_ERROR' })
    }
})

router.post('/run', jwtDecoder, async (req, res) => {
    
    console.log("Received run request")
    console.log(req.body.language)
    console.log(req.body.code)


    const { username, code, language } = req.body

        const runResults = await CodeRunner.RunCode(code, language)

        res.status(201).json(runResults)
        return

    try {
        
    }
    catch (error) {
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