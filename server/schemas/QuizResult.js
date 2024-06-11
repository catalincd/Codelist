const mongo = require('mongoose');
const Schema = mongo.Schema;


const QuizResult = new mongo.Schema({
    quizId: { type: Number, unique: true, required: true },
    results: { type: Object, default: {} }, 
}, {timestamps: true});

module.exports = mongo.model('QuizResult', QuizResult);