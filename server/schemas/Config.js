const mongo = require('mongoose');

const Config = new mongo.Schema({
    configId: { type: String, unique: true, required: true, default: 1 },
    hostname: { type: String, required: true, default: 'localhost' },
    problemsCount: { type: Number, required: true, default: 0 },
    solutionsCount: { type: Number, required: true, default: 0 },
    usersCount: { type: Number, required: true, default: 5 },
    articlesCount: { type: Number, required: true, default: 0 },
    quizzesCount: { type: Number, required: true, default: 5 },
    quizSolutionsCount: { type: Number, required: true, default: 5 },
}); 

module.exports = mongo.model('Config', Config);