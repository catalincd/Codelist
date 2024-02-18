const express = require('express')
const router = express.Router()

const User = require('../schemas/User')
const ConfigManager = require('../utils/ConfigManager')

const jwtDecoder = require('../middlewares/jwtDecoder')
const Problem = require('../schemas/Problem')

router.use((req, res, next) => {
    console.log('Data Req: ', Date.now())
    next()
})

router.post('/create', jwtDecoder, async (req, res) => {
    try {
        const { name, preview, text, tests } = req.body

        const searchedProblem = await Problem.findOne({ name })
        if (searchedProblem) {
            return res.status(401).json({ error: 'PROBLEM_NAME_ALREADY_USED' })
        }

        const id = await ConfigManager.GetNewProblemId()


        const problem = new Problem({id, name, preview, text, tests})
        await problem.save()

        res.status(201).json({ message: 'PROBLEM_REGISTER_SUCCESS' })
    }
    catch (error) {
        res.status(500).json({ error: 'PROBLEM_SERVER_ERROR' })
    }
})

router.get('/details', async (req, res) => {
    try {
        const id = req.body.id || req.query.id

        const searchedProblem = await Problem.findOne({ id })

        if (!searchedProblem) {
            return res.status(401).json({ error: 'PROBLEM_NOT_FOUND' })
        }

        searchedProblem.views += 1
        searchedProblem.save()

        res.status(200).json(searchedProblem)
    }
    catch (error) {
        res.status(500).json({ error: 'PROBLEM_SERVER_ERROR' })
    }
})


module.exports = router