const User = require('../../schemas/User')
const Quiz = require('../../schemas/Quiz')
const QuizSolution = require('../../schemas/QuizSolution')

const ConfigManager = require('../ConfigManager')

const fs = require('fs')
const jwt = require('jsonwebtoken')
const JWT_KEY = fs.readFileSync('/keys/jwt_key')

const GetNewTry = async (user, quiz) => {
    const dateNow = new Date()
    const token = jwt.sign({ uid: user._id, date: dateNow}, JWT_KEY, {expiresIn: '3d' })

    const newId = await ConfigManager.GetNewQuizSolutionId()
    var solutionId = -1
    

    const oldSolution = await QuizSolution.findOne({ id: newId}) // REACT DOUBLE LOADING IS NOT AMAZING STOP IT PLEASE
    if(oldSolution)
        solutionId = oldSolution._id
    else{
        const newSolution = new QuizSolution({id: newId, quizId: quiz.id, username: user.username})
        await newSolution.save()
        solutionId = newSolution._id
    }

    const newTry = {
        userStartTime: dateNow,
        expires: quiz.maxTime? new Date().setMinutes(dateNow.getMinutes() + quiz.maxTime): quiz.endTime,
        token, 
        solutionId
    }

    const oldTries = user.quizzes? (user.quizzes[quiz.id] || []) : [];

    const newQuizArray = user.quizzes || {}
    newQuizArray[quiz.id] = [...oldTries, newTry]

    user.quizzes = newQuizArray
    user.markModified("quizzes")
    await user.save()

    return newTry
}

const GetLatestTry = async (user, quiz) => {
    if(!user.quizzes) return null
    if(!user.quizzes[quiz.id]) return null
    const quizTries = user.quizzes[quiz.id]
    const latestTry = quizTries[quizTries.length - 1]

    const dateNow = new Date()
    if(quiz.endTime && dateNow > quiz.endTime) return null


    console.log(latestTry.userStartTime)

    if(quiz.maxTime && ((dateNow.getTime() - latestTry.userStartTime.getTime()) / 60000) > quiz.maxTime) /// TO DO Test this
    {
        console.log("OUT OF MAX TIME")
        return null
    }

    const thisSolution = await QuizSolution.findOne({_id: latestTry.solutionId})

    return {...latestTry, scores: thisSolution.toObject().steps.map(step => step? step.score || 0 : 0)}
}


const GetQuizToken = async (user, quiz) => {
    var latestTry = await GetLatestTry(user, quiz)

    
    // TO DO CHECK IF NEW TRIES AVAILABLE FOR THIS USER
    if(!latestTry){
        if(quiz.maxTries && user.quizzes && user.quizzes[quiz.id] && user.quizzes[quiz.id].length >= quiz.maxTries)
        {
            console.log("OUT OF TRIES")
            return { outOfTries: true }  
        }  
        else 
        {
            latestTry = await GetNewTry(user, quiz)  
        }
            
    }

    /// ... TO DO SOMETHING
    
    return latestTry
}


const ValidateUserToken = async (user, quiz, token) => {
    var latestTry = await GetLatestTry(user, quiz)

    return latestTry? (latestTry.token == token) : false
} 


module.exports = { GetQuizToken, ValidateUserToken } 