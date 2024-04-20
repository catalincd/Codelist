const axios = require("axios")
const cluster = require("fs").readFileSync("./server/keys/cluster", "utf8").replace(" ", "").replace("\n", "")

const Problem = async () => {

}

const Code = async (source, language, username) => {
    let codeResponse = null
    try {
        const response = await axios.post(`http://${cluster}:30070/code`, { source, language, username }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        codeResponse = response.data
    } catch (error) {
        console.log(error.toString())
        codeResponse = { error }
    }
    finally {
        return codeResponse
    }
}

module.exports = { Problem, Code }