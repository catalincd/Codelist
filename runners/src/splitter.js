const fs = require("fs")
const { exec, execSync} = require("child_process")

const cpp = require("./compilers/cpp.js")
const python = require("./compilers/python.js")
const javascript = require("./compilers/javascript.js")
const java = require("./compilers/java.js")
const csharp = require("./compilers/csharp.js")


const SplitRunner = (language) => {
    if(language.toLowerCase() == "cpp") return cpp
    if(language.toLowerCase() == "py") return python
    if(language.toLowerCase() == "js") return javascript
    if(language.toLowerCase() == "java") return java
    if(language.toLowerCase() == "cs") return csharp
    return null
}

const InitCodeFolder = (source, username, language) => {

    // TO-DO: add source file verifier for every language

    // TO-DO: add exec lock

    const folder = `/runner/${username}`
    execSync(`mkdir -p ${folder}`)
    execSync(`rm -rf ${folder}/*`)

    source.forEach(({name, code}) => {
        fs.writeFileSync(`${folder}/${name}`, code)
    })
    
    return folder
}

const GetTimeFromStderr = (output) => {
    const [memory, time] = output.split('\n').slice(-2)[0].split(' ')
    stderr = output.split('\n').slice(0, -2).concat('').join('\n') // + '\n'
    return {stderr, memory, time}
}

const ExecSync = (cmd, options = {}, input = null) => new Promise((resolve, reject) => {
    const childProc = exec(cmd, options, (err, stdout, stderr) => {
        resolve({err, stdout, stderr})
    })

    if(input){
        childProc.stdin.write(input)
        childProc.stdin.end()
    }
})

const Trim = (str) => str.replace(/ +(?= )/g,'').replace(/(\r\n|\n|\r)/gm, "") // TO-DO: repair this somehow

const ExecCode = async (source, username, language, stdin = null) => {
    const folder = InitCodeFolder(source, username, language)
    const runner = SplitRunner(language)
    const compileResults = await runner.compile(folder, source, ExecSync)

    if(compileResults.error){
        return {error: compileResults.error.toString()}
    }

    const runtimeResults = await runner.run(folder, source, ExecSync, stdin)
    return {...runtimeResults, ...GetTimeFromStderr(runtimeResults.stderr)}
}

const ExecProblem = async (source, username, language, files, tests) => {
    const folder = InitCodeFolder(source, username, language)
    const runner = SplitRunner(language)
    const compileResults = await runner.compile(folder, source, ExecSync)

    if(compileResults.error){
        return {error: compileResults.error.toString(), stderr: compileResults.stderr}
    }

    let testResults = []
    let mainOutput = null
    let time = 0
    let memory = 0

    try{
        for(var i=0;i<tests.length;i++){
            const test = tests[i]
            if(!(files.stdin)) fs.writeFileSync(`${folder}/${files.inputName}`, test.inputValue)
            const runtimeResults = await runner.run(folder, source, ExecSync, files.stdin? test.inputValue : null)
            // const parsedResults = {...runtimeResults, ...GetTimeFromStderr(runtimeResults.stderr)}
            // TO-DO: check here for mem and timeout
            if(runtimeResults.error){
                return {error: runtimeResults.error.toString(), stderr: runtimeResults.stderr}
            }


            let output = ""
            if(files.stdout)
                output = runtimeResults.stdout
            else
            {
                try
                {
                    output = fs.readFileSync(`${folder}/${files.outputName}`, 'utf8')
                }
                catch(e)
                {
                    output = ""
                }
            } 
            testResults.push(Trim(output) == test.outputValue)
            mainOutput = mainOutput || runtimeResults.stderr

            time = runtimeResults.time > time? runtimeResults.time : time
            memory = runtimeResults.memory > memory? runtimeResults.memory : memory
        }
    }
    catch(e){
        return {reqError: e.toString()}
    }
    
    return {error: null, time, memory, tests: testResults}
}

module.exports = {ExecCode, ExecProblem}

//Tests:
/*
const problem1 = {files: {stdin: true, stdout: true}, tests: [{outputValue: "1", inputValue: "1"}, {outputValue: "2", inputValue: "2"}, {outputValue: "2", inputValue: "1"}]}
ExecProblem([{name: "HelloWorld.cs", code: fs.readFileSync("./tests/p1/p1.cs")}], "wizzzard", "cs", problem1).then(data => console.log(data))
ExecProblem([{name: "HelloWorld.cpp", code: fs.readFileSync("./tests/p1/p1.cpp")}], "wizzzard", "cpp", problem1).then(data => console.log(data))
ExecProblem([{name: "HelloWorld.java", code: fs.readFileSync("./tests/p1/p1.java")}], "wizzzard", "java", problem1).then(data => console.log(data))
ExecProblem([{name: "HelloWorld.js", code: fs.readFileSync("./tests/p1/p1.js")}], "wizzzard", "js", problem1).then(data => console.log(data))
ExecProblem([{name: "HelloWorld.py", code: fs.readFileSync("./tests/p1/p1.py")}], "wizzzard", "py", problem1).then(data => console.log(data))

const problem2 = {files: {stdin: false, inputName: "file.in", stdout: false, outputName: "file.out"}, tests: [{outputValue: "2", inputValue: "1"}]}
ExecProblem(fs.readFileSync("./src/compilers/code2.cpp"), "wizzzard", "cpp", problem2).then(data => console.log(data))
*/