const express = require('express')
const router = express.Router()

const ConfigManager = require('../utils/ConfigManager')
const CodeRunner = require('../utils/CodeRunner')

const jwtDecoder = require('../middlewares/jwtDecoder')
const Solution = require('../schemas/Solution')

router.use((req, res, next) => {
    console.log('Data Req: ', Date.now())
    next()
})

router.post('/send', jwtDecoder, async (req, res) => {
    const { problemId, username, code } = req.body

    const {runtime, memory, error, tests, output} = await CodeRunner.RunCode(problemId, code)

    const id = await ConfigManager.GetNewSolutionId()
    const solution = new Solution({ id, problemId, username, code, runtime, memory, error, tests, output })
    await solution.save()

    res.status(201).json(solution)
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