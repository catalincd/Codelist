const Docker =  require('simple-dockerode')
const docker = new Docker()
const ContainerManager = require('./ContainerManager')




const RUNNERS = ['gxx', 'python']
var CONTAINERS = {}

const OnSetup = async () => {
    console.log('Setting up containers...\n')

    await ContainerManager.CreateImages(RUNNERS)

    CONTAINERS = await ContainerManager.AssignImages()

    const test = await RunProblem("gxx", "#include<iostream>\n#include<fstream>\nusing namespace std;ofstream fout(\"output.txt\");int main(){std::cout<<\"Hello World!\"<<std::endl;fout<<\"Hello World!\"<<std::endl;fout.close();return 0;}", [{inputName: "input.txt", inputValue: "5", outputName: "output.txt", outputValue: "15"}])
    console.log("RAN TEST:")
    console.log(test)
}


const GetTimeFromStderr = (output) => {
    const [memory, time] = output.split('\n').slice(-2)[0].split(' ')
    stderr = output.split('\n').slice(0, -2).join('\n')
    return {stderr, memory, time}
}


const RunCode = async (language, code) => {
    const runResult = await RunSwitch(language, code)
    
    const compileError = runResult.compileError
    const runtimeError = compileError? null : runResult.runtimeError

    const compileProps = GetTimeFromStderr(runResult.compileResults.stderr)
    const compileMemory = compileProps.memory
    const compileStderr = compileProps.stderr
    const compileStdout = runResult.compileResults.stdout
    const compileTime = compileProps.time

    const runtimeProps = compileError? null : GetTimeFromStderr(runResult.runtimeResults.stderr)
    const runtimeMemory = compileError? null : runtimeProps.memory
    const runtimeStderr = compileError? null : runtimeProps.stderr
    const runtimeStdout = compileError? null : runResult.runtimeResults.stdout
    const runtimeTime = compileError? null : runtimeProps.time

    // return {compileError, compileStderr, compileStdout, compileTime, compileMemory, runtimeError, runtimeMemory, runtimeStderr, runtimeStdout, runtimeTime}

    return {
        error: compileError || runtimeError,
        time: runtimeTime,
        output: NewlineTrim(compileError? [compileStdout, compileStderr].join('\n') : [compileStdout, runtimeStdout, runtimeStderr].join('\n')),
        memory: runtimeMemory
    }
}

const RunProblem = async (language, code, problemTests) => {

    let tests = []
    let error = false
    let output = ""
    let time = 0
    let memory = 0

    for(var i=0;i<problemTests.length;i++)
    {
        var validTest = false
        try
        {
            const testResult = await RunTestSwitch(language, code, problemTests[i])

            let compileProps = GetTimeFromStderr(testResult.compileResults.stderr)
            let runtimeProps = GetTimeFromStderr(testResult.runtimeResults.stderr)

            error = (error || testResult.compileError || testResult.runtimeError) // change this sometime...
            validTest = Retrim(testResult.testOutput) == Retrim(problemTests[i].outputValue)

            time = time > parseInt(runtimeProps.time)? time : parseInt(runtimeProps.time)
            memory = memory > parseInt(runtimeProps.memory)? memory : parseInt(runtimeProps.memory)
            
            output = NewlineTrim(compileProps.stderr + '\n' + testResult.compileResults.stdout)
        }
        catch(e)
        {
            console.log(e)
        }
        finally
        {
            tests.push(validTest)
        }
    }


    
    
    return {time, memory, error, tests, output}
}

const RunSwitch = async (language, code, test) => {
    if(language == "gxx")
        return (await RunGXX(code, test))


    return null
}

const RunTestSwitch = async (language, code, test) => {
    if(language == "gxx")
        return (await RunTestGXX(code, test))


    return null
}


const RunGXX = async (code, test) => {
    //change to current user here?
    await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['rm', '-rf',`/compiler`], {})
    await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['mkdir', '-p',`/compiler`], {})

    await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['tee', `/compiler/main.cpp`], {stdin: code})

    const compileResults = await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['ash', '-c', '/usr/bin/time -f "%M %e" g++ /compiler/main.cpp -o /compiler/main.o'], {stdout: true, stderr: true})
    const compileError = (compileResults.inspect.ExitCode != 0)

    if(compileError)
        return {compileResults, compileError, runtimeResults: {}, runtimeError: {}}

    const runtimeResults = await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['ash', '-c', 'cd compiler && /usr/bin/time -f "%M %e" ./main.o'], {stdout: true, stderr: true})
    const runtimeError = (runtimeResults.inspect.ExitCode != 0)

    return {compileResults, compileError, runtimeResults, runtimeError}
}


const RunTestGXX = async (code, test) => {
    const stdinContent = (test.inputName == "stdin")?  test.inputValue : null 

    //change to current user here?
    await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['rm', '-rf',`/compiler`], {})
    await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['mkdir', '-p',`/compiler`], {})

    await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['tee', `/compiler/main.cpp`], {stdin: code})
    await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['tee', `/compiler/${test.inputName}`], {stdin: test.inputValue})

    const compileResults = await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['ash', '-c', '/usr/bin/time -f "%M %e" g++ /compiler/main.cpp -o /compiler/main.o'], {stdout: true, stderr: true})
    const compileError = (compileResults.inspect.ExitCode != 0)

    const runtimeResults = await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['ash', '-c', 'cd compiler && /usr/bin/time -f "%M %e" ./main.o'], stdinContent? {stdin: stdinContent, stdout: true, stderr: true}:{stdout: true, stderr: true})
    const runtimeError = (runtimeResults.inspect.ExitCode != 0)
    const runtimeStdout = runtimeResults.stdout

    const outputResults = await exec_container_async(docker.getContainer(CONTAINERS["gxx"]), ['cat', `/compiler/${test.outputName}`], {stdout: true})
    const outputFile = outputResults.stdout

    const testOutput = test.outputName == "stdout"? runtimeStdout : outputFile
    return {compileError, compileResults, runtimeError, runtimeStdout, runtimeResults, testOutput}
}

const exec_container_async = async (container, cmds, streams) => {
    return new Promise((resolve) => {
        container.exec(cmds, streams, (error, results) => {
            resolve(results)
        })
    })
}


const Retrim = (string) => string.replace(/ +(?= )/g,'').replace(/(\r\n|\n|\r)/gm, "");

const NewlineTrim = (string) => string.split('\n').filter(x => x.length > 0).join('\n')

const GetRunners = () => RUNNERS


OnSetup()



module.exports = {GetRunners, RunProblem, RunCode}