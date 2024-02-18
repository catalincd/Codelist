const mongo = require('mongoose');

const Config = new mongo.Schema({
    configId: { type: String, unique: true, required: true, default: 1 },
    problemsCount: { type: Number, required: true, default: 0 },
    hostname: { type: String, required: true, default: 'localhost' },
}); 

module.exports = mongo.model('Config', Config);