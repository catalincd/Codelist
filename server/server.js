const express = require('express')
const mongoose = require('mongoose')

const auth = require('./routes/auth')
const data = require('./routes/data')
const problems = require('./routes/problems')

const app = express()
const port = 8080



mongoose.connect('mongodb://localhost:27017/codelist', {
    serverSelectionTimeoutMS: 1000,
    autoIndex: true
})

app.use(express.json())

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.use('/data', data)
app.use('/auth', auth)
app.use('/problems', problems)



app.get('/hello', (req, res) => {
    console.log(req.body)
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Started running on ${port}`)
})