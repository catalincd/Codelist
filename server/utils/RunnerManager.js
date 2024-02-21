const Docker =  require('simple-dockerode')
const docker = new Docker()
const ContainerManager = require('./ContainerManager')




const RUNNERS = ['gxx', 'python']
var CONTAINERS = {}

const OnSetup = async () => {
    console.log('Setting up containers...\n')

    await ContainerManager.CreateImages(RUNNERS)

    CONTAINERS = await ContainerManager.AssignImages()

    const test = await Run("gxx", "#include<iostream>\n#include<fstream>\nusing namespace std;ofstream fout(\"output.txt\");int main(){std::cout<<\"Hello World!\"<<std::endl;fout<<\"Hello World!\"<<std::endl;fout.close();return 0;}", [{inputName: "input.txt", inputValue: "5", outputName: "output.txt", outputValue: "15"}])
}


const Run = async (language, code, problemTests) => {

    let tests = []
    var error = false
    var output = ""

    for(var i=0;i<problemTests.length;i++)
    {
        const testResult = await RunSwitch(language, code, problemTests[i])
        error = (error || testResult.compileError || testResult.runtimeError) // change this sometime...

        // console.log(`!${Retrim(testResult.testOutput)}!`, `!${Retrim(problemTests[i].outputValue)}!`)

        tests.push(Retrim(testResult.testOutput) == Retrim(problemTests[i].outputValue))

        testResult.runtimeError && (output += testResult.runtimeStdout) // add compile here as well...
    }


    const runtime = 17
    const memory = 120
    
    return {runtime, memory, error, tests, output}
}


const RunSwitch = async (language, code, test) => {
    if(language == "gxx")
        return (await RunGXX(code, test))


    return null
}

const RunGXX = async (code, test) => {
    const stdinContent = (test.inputName == "stdin")?  test.inputValue : null 

    //change to current user here?
    await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['rm', '-rf',`/compiler`], {})
    await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['mkdir', '-p',`/compiler`], {})

    await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['tee', `/compiler/main.cpp`], {stdin: code})
    await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['tee', `/compiler/${test.inputName}`], {stdin: test.inputValue})

    const compileResults = await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['g++','/compiler/main.cpp', '-o', '/compiler/main.o'], {stdout: true}, {stderr: true})
    const compileError = (compileResults.inspect.ExitCode != 0)

    const runtimeResults = await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['ash', '-c', 'cd compiler && ./main.o'], stdinContent? {stdin: stdinContent, stdout: true}:{stdout: true}, {stderr: true})
    const runtimeError = (runtimeResults.inspect.ExitCode != 0)
    const runtimeStdout = runtimeResults.stdout

    const outputResults = await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['cat', `/compiler/${test.outputName}`], {stdout: true})
    const outputFile = outputResults.stdout

    const testOutput = test.outputName == "stdout"? runtimeStdout : outputFile
    return {compileError, runtimeError, runtimeStdout, testOutput}
}

const exec_container_async = async (container, cmds, streams) => {
    return new Promise((resolve) => {
        container.exec(cmds, streams, (error, results) => {
            resolve(results)
        })
    })
}


const Retrim = (string) => string.replace(/ +(?= )/g,'').replace(/(\r\n|\n|\r)/gm, "");


const GetRunners = () => RUNNERS


OnSetup()



module.exports = {GetRunners, Run}