const Config = require('../schemas/Config')
const CONFIG_ID = 2


const GetConfigVar = async (varName) => {
    const configId = CONFIG_ID

    const thisConfig = await Config.findOne({ configId })

    return thisConfig[varName]
}

const SetConfigVar = async (updateObject) => {
    const configId = CONFIG_ID

    await Config.findOneAndUpdate({ configId }, updateObject, {
        new: true,
        upsert: true
    });
}

const GetNewProblemId = async () => {
    const problemId = await GetConfigVar("problemsCount") + 1
    await SetConfigVar({problemsCount: problemId})
    return problemId
}


module.exports = {GetConfigVar, SetConfigVar, GetNewProblemId}
