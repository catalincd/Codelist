const mongo = require('mongoose');

const QuizSolution = new mongo.Schema({
    id: { type: Number, unique: true, required: true },
    quizId: { type: Number, required: true },
    username: { type: String, required: true, default: "" },
    score: { type: Number, required: true, default: 0 },
    steps: { type: Array, required: true, default: [] }, 
}, {timestamps: true});

module.exports = mongo.model('QuizSolution', QuizSolution);