const mongo = require('mongoose');

const User = new mongo.Schema({
    id: { type: Number, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    activated: { type: Boolean, default: false},
    password: { type: String, required: true, default: "-" },
    googleid: { type: String, required: true, default: "-"},
    picture: { type: String, default: "default.png" },
    description: { type: String, default: "Codelist user" },
    likedArticles: { type: Array, required: true, default: []},
    likedProblems: { type: Array, required: true, default: []},
    ratedArticles: { type: Array, required: true, default: []},
    ratedProblems: { type: Array, required: true, default: []},
    likedQuizzes: { type: Array, required: true, default: []},
    ratedQuizzes: { type: Array, required: true, default: []},
    quizzes: { type: Object, required: true, default: {}},
}, {timestamps: true});

module.exports = mongo.model('User', User);