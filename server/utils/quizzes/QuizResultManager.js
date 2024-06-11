const ConfigManager = require('../ConfigManager')

const User = require('../../schemas/User')
const Quiz = require('../../schemas/Quiz')
const Solution = require('../../schemas/Solution')
const QuizSolution = require('../../schemas/QuizSolution')
const QuizResult = require('../../schemas/QuizResult')


const newId = ConfigManager.GetNewQuizSolutionId()




const ManageNewSolution = async (solution, quiz) => {
    if(!quiz.id) {
        console.log("NULL QUIZ ID")
        return
    }

    var quizResult = await QuizResult.findOne({ quizId: quiz.id })

    if(!quizResult){
        console.log("NEWW QUIZ RESULT: " + quiz.id)
        quizResult = new QuizResult({ quizId: quiz.id })
    }
    await quizResult.save()

    const username = solution.username

    if(quizResult.results[username])
    {
        const result = quizResult.results[username]
        if(solution.score > result.score)
        {
            quizResult.results[username] = {score: solution.score, solutionId: solution._id}
            quizResult.markModified("results")
        }
    }
    else
    {
        quizResult.results[username] = {score: solution.score, solutionId: solution._id}
        quizResult.markModified("results")
    }
    
    
    await quizResult.save()
}

const PopulateSolution = async (quizResults) => {
    const usernames = Object.keys(quizResults.results)
    const solutionIds = usernames.map((user) => quizResults.results[user].solutionId)
    const solutionObjects = await QuizSolution.find({_id: { $in: solutionIds}})
    console.log(solutionObjects)

    const populatedResults = usernames.map((user) => {
        const result = quizResults.results[user]
        const foundSolution = solutionObjects.find((s) => {
            console.log(s._id.toString())
            return s._id.toString() == result.solutionId.toString()
        }).toObject()

        return {score: result.score, ...foundSolution, steps: sanitizeSteps(foundSolution.steps)}
    })

    populatedResults.sort((a, b) => b.score - a.score)

    return populatedResults
}

const sanitizeSteps = (steps) => steps.map(step => {return {score: step.score? step.score : 0}})

module.exports = { ManageNewSolution, PopulateSolution}