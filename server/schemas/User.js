const mongo = require('mongoose');

const User = new mongo.Schema({
    id: { type: Number, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    activated: { type: Boolean, default: false},
    password: { type: String, required: true },
    picture: { type: String, default: "default.png" },
    description: { type: String, default: "Codelist user" },
}, {timestamps: true});

module.exports = mongo.model('User', User);