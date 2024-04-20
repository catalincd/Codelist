const express = require('express')
const router = express.Router()

const User = require('../schemas/User')
const ConfigManager = require('../utils/ConfigManager')

const apiAuth = require('../middlewares/apiAuth')
const Problem = require('../schemas/Problem')

router.use((req, res, next) => {
    // console.log('Data Req: ', Date.now())
    next()
})

router.post('/', apiAuth, async (req, res) => {
    try {
        const { name, preview, text, files, tests, examples } = req.body

        const searchedProblem = await Problem.findOne({ name })
        if (searchedProblem) {
            return res.status(401).json({ error: 'PROBLEM_NAME_ALREADY_USED' })
        }

        const id = await ConfigManager.GetNewProblemId()


        const problem = new Problem({id, name, preview, text, tests, examples, files, creator: req.user.username})
        await problem.save()

        res.status(201).json({ message: 'PROBLEM_REGISTER_SUCCESS', id})
    }
    catch (error) {
        res.status(500).json({ error: 'PROBLEM_SERVER_ERROR' })
    }
})

router.get('/', async (req, res) => {
    try {
        if (!(req.query.id)) {
            return res.status(406).json({ error: 'ID_OR_FILTER_NOT_FOUND' })
        }

        const searchedProblem = await Problem.findOne({ id: req.query.id })

        if (!searchedProblem) {
            return res.status(404).json({ error: 'PROBLEM_NOT_FOUND' })
        }

        searchedProblem.views += 1
        searchedProblem.save()

        res.status(200).json(searchedProblem)
    }
    catch (error) {
        res.status(500).json({ error: 'PROBLEM_SERVER_ERROR' })
    }
})

router.get('/homescreen', async (req, res) => {
    try {
        var searchedProblems = (await Problem.find({}).limit(5)) || []

        console.log(searchedProblems)
        // searchedProblems = searchedProblems.flatMap(problem => [problem, problem, problem])

        res.status(200).json(searchedProblems)
    }
    catch (error) {
        res.status(500).json({ error: 'PROBLEM_SERVER_ERROR' })
    }
})


module.exports = router