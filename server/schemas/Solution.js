const mongo = require('mongoose');

const Solution = new mongo.Schema({
    id: { type: Number, unique: true, required: true },
    problemId: { type: Number, required: true },
    username: { type: String, required: true },
    code: { type: String, required: true },
    runtime: { type: Number, default: 0 },
    memory: { type: Number, default: 0 },
    error: { type: Boolean, default: false },
    output: { type: String, default: ""},
    tests: { type: Object, default: []},
}, {timestamps: true});

module.exports = mongo.model('Solution', Solution);