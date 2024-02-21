const express = require('express')
const mongoose = require('mongoose')

const auth = require('./routes/auth')
const data = require('./routes/data')
const problems = require('./routes/problems')
const solutions = require('./routes/solutions')

const app = express()
const port = parseInt(require('fs').readFileSync('./server/port').toString()) || 8080



mongoose.connect('mongodb://localhost:27017/codelist', {
    serverSelectionTimeoutMS: 1000,
    autoIndex: true
})

app.use('/', express.static('server/build'))

app.use(express.json())

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // very unsafe
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.use('/data', data)
app.use('/auth', auth)
app.use('/problems', problems)
app.use('/solutions', solutions)






app.listen(port, () => {
    console.log(`Started running on ${port}`)
})