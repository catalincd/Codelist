const mongo = require('mongoose');

const Problem = new mongo.Schema({
    id: { type: Number, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    preview: { type: String, required: true },
    text: { type: String, default: "" },
    views: { type: Number, required: true, default: 0 },
    solved: { type: Number, required: true, default: 0 },
    solveTries: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0.0 },
    ratingsCount: { type: Number, required: true, default: 0 },
    files: { type: Object, required: true, default: {stdin: true, stdout: true}},
    examples: { type: Object, required: true, default: []},
    tests: { type: Object, required: true, default: []},
    creator: { type: String, required: true }
}, {timestamps: true});

module.exports = mongo.model('Problem', Problem);