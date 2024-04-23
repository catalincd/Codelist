const axios = require("axios")
const cluster = require("fs").readFileSync("./server/keys/cluster", "utf8").replace(" ", "").replace("\n", "")

const Problem = async (source, language, username, files, tests) => {
    let codeResponse = null
    try {
        const response = await axios.post(`http://${cluster}:30070/problem`, { source: SanitizeCode(source), language, username, files, tests }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        codeResponse = response.data
    } catch (error) {
        console.log(error.toString())
        codeResponse = { error: error.message }
    }
    finally {
        return codeResponse
    }
}

const Code = async (source, language, username) => {
    let codeResponse = null
    try {
        const response = await axios.post(`http://${cluster}:30070/code`, { source: SanitizeCode(source), language, username, stdin: GetStdinFromSource(source) }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        codeResponse = response.data
    } catch (error) {
        console.log(error.toString())
        codeResponse = { error: error.message }
    }
    finally {
        return codeResponse
    }
}

const GetStdinFromSource = (source) => {
    const stdinFile = source.find(file => file.name == "__stdin")

    return stdinFile? stdinFile.code || null : null
}

const SanitizeCode = (source) => source.filter(file => file.name != "__stdin").map(file => {
    return {name: file.name.replace("..", ""), code: file.code}
})

module.exports = { Problem, Code }