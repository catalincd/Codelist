const Config = require('../schemas/Config')
const CONFIG_ID = 1


const GetConfigVar = async (varName) => {
    const configId = CONFIG_ID

    const thisConfig = await Config.findOneAndUpdate({ configId }, {}, {
        new: true,
        upsert: true
    });

    return thisConfig[varName]
}

const SetConfigVar = async (updateObject) => {
    const configId = CONFIG_ID

    await Config.findOneAndUpdate({ configId }, updateObject, {
        new: true,
        upsert: true
    });
}

const GetNewUserId = async () => {
    const userId = await GetConfigVar("problemsCount") + 1
    await SetConfigVar({usersCount: userId})
    return userId
}

const GetNewProblemId = async () => {
    const problemId = await GetConfigVar("problemsCount") + 1
    await SetConfigVar({problemsCount: problemId})
    return problemId
}

const GetNewSolutionId = async () => {
    const solutionId = await GetConfigVar("solutionsCount") + 1
    await SetConfigVar({solutionsCount: solutionId})
    return solutionId
}



module.exports = {GetConfigVar, SetConfigVar, GetNewProblemId, GetNewSolutionId, GetNewUserId}
