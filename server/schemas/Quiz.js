const mongo = require('mongoose');

const Quiz = new mongo.Schema({
    id: { type: Number, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    preview: { type: String, required: true },
    intro: { type: String, required: true, default: ""},
    views: { type: Number, required: true, default: 0 },
    solved: { type: Number, required: true, default: 0 },
    solveTries: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0.0 },
    ratingsCount: { type: Number, required: true, default: 0 },
    steps: { type: Object, required: true, default: []},
    creator: { type: String, required: true },
    startTime: { type: Date, default: null }, 
    endTime: { type: Date, default: null }, 
    maxTime: { type: Number, default: null },
    maxTries: { type: Number, default: null },
    password: { type: String, default: null },
    publicResults: { type: Boolean, default: true },
}, {timestamps: true});

module.exports = mongo.model('Quiz', Quiz);