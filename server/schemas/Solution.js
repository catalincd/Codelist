const mongo = require('mongoose');

const Solution = new mongo.Schema({
    id: { type: Number, unique: true, required: true },
    problemId: { type: Number, required: true },
    username: { type: String, required: true },
    time: { type: Number, default: 0 },
    memory: { type: Number, default: 0 },
    error: { type: String, default: false },
    tests: { type: Object, default: []},
}, {timestamps: true});

module.exports = mongo.model('Solution', Solution);