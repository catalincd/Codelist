const Problem = require('../schemas/Problem')
const fs = require('fs')

const Docker = require('dockerode');
var docker = new Docker();

const RunnerManager = require('./RunnerManager')



const GetTests = async (id) => (await Problem.findOne({ id })).tests

const RunCode = async (problemId, code) => {
    const problemTests = await GetTests(problemId)

    const {runtime, memory, error, tests, output} = await RunnerManager.Run("gxx", code, problemTests)

    return {runtime, memory, error, tests, output}
}

module.exports = {RunCode}