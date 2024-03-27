const Problem = require('../schemas/Problem')
const fs = require('fs')

const Docker = require('dockerode');
var docker = new Docker();

const RunnerManager = require('./RunnerManager')



const GetTests = async (id) => (await Problem.findOne({ id })).tests

const RunSolutionCode = async (problemId, code, language) => {
    const problemTests = await GetTests(problemId)

    const {time, memory, error, tests, output} = await RunnerManager.RunProblem(language, code, problemTests)

    return {time, memory, error, tests, output}
}


const RunCode = async (code, language) => {
    const results = await RunnerManager.RunCode(language, code)
    return results
}

module.exports = {RunCode, RunSolutionCode}