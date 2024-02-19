const mongo = require('mongoose');

const User = new mongo.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
}, {timestamps: true});

module.exports = mongo.model('User', User);