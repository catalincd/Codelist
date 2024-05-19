const Config = require('../schemas/Config')
const CONFIG_ID = 1
var latestQuizSolutionId = -1

const InitConfig = async () => {
    latestQuizSolutionId = await GetConfigVar("quizSolutionsCount")
}

const GetConfigFull = async () => {
    const configId = CONFIG_ID

    const thisConfig = await Config.findOneAndUpdate({ configId }, {}, {
        new: true,
        upsert: true
    });

    return thisConfig
}

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
    const userId = await GetConfigVar("usersCount") + 1
    await SetConfigVar({usersCount: userId})
    return userId
}

const GetNewProblemId = async () => {
    const problemId = await GetConfigVar("problemsCount") + 1
    await SetConfigVar({problemsCount: problemId})
    return problemId
}

const GetNewArticleId = async () => {
    const articleId = await GetConfigVar("articlesCount") + 1
    await SetConfigVar({articlesCount: articleId})
    return articleId
}

const GetNewSolutionId = async () => {
    const solutionId = await GetConfigVar("solutionsCount") + 1
    await SetConfigVar({solutionsCount: solutionId})
    return solutionId
}

const GetNewQuizId = async () => {
    const quizId = await GetConfigVar("quizzesCount") + 1
    await SetConfigVar({quizzesCount: quizId})
    return quizId
}

const GetNewQuizSolutionId = async () => {
    latestQuizSolutionId += 1
    SetConfigVar({quizSolutionsCount: latestQuizSolutionId})
    return latestQuizSolutionId
}


InitConfig()
module.exports = {GetConfigFull, GetNewQuizSolutionId, GetConfigVar, SetConfigVar, GetNewProblemId, GetNewSolutionId, GetNewUserId, GetNewArticleId, GetNewQuizId}
