const Problem = require('../schemas/Problem')
const fs = require('fs')

const Docker = require('dockerode');
var docker = new Docker();



const GetTests = async (id) => (await Problem.findOne({ id })).tests

const RunCode = async (problemId, code) => {
    const problemTests = await GetTests(problemId)
    const tests = []

    for(var i=0;i<problemTests.length;i++){
        const test = problemTests[i]
        fs.writeFileSync(`./temp/${test.inputName}`, test.inputValue)
        
    }



    const runtime = 17
    const memory = 100
    const error = true
    const output = docker.getContainer("ce7528fa1122").exec({Cmd: ['ls'], AttachStdin: true, AttachStdout: true}, function(err, exec) {
        exec.start({hijack: true, stdin: true}, function(err, stream) {
          //fs.createReadStream('node-v5.1.0.tgz', 'binary').pipe(stream);
          stream.on('data', data => console.log(data.toString()));
          

        });
    });

    return {runtime, memory, error, tests, output}
}

module.exports = {RunCode}