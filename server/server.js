const https = require('https')
const express = require('express')
const mongoose = require('mongoose')

const auth = require('./routes/auth')
const data = require('./routes/data')
const problems = require('./routes/problems')
const solutions = require('./routes/solutions')

const path = require("path");
const fs = require('fs')

const app = express()
const port = parseInt(fs.readFileSync('./server/port').toString()) || 8080
const domain = fs.readFileSync('./server/domain').toString() || "codelist.ro"

const mongo_key = fs.readFileSync('./server/keys/mongo_key').toString()
const ssl_cert = fs.readFileSync('/keys/ssl_cert').toString()
const ssl_key = fs.readFileSync('/keys/ssl_key').toString()
const ssl_ca = fs.readFileSync('/keys/ssl_ca').toString()

console.log(`KEY:|${mongo_key}|`)

mongoose.connect('mongodb://localhost:27017', {
    serverSelectionTimeoutMS: 1000,
    autoIndex: true,
    user: "user",
    pass: mongo_key,
    dbName: "codelist"
})



app.use(express.json())

app.use(function (req, res, next) {
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


app.use('/', express.static('server/build'))
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "server/build", "index.html"));
});


https.createServer({
    key: ssl_key,
    cert: ssl_cert,
    ca: ssl_ca
}, app).listen(port);


const redir_app = express()
redir_app.use(function(req, res) {
    res.redirect('https://' + domain + req.originalUrl);
});
redir_app.listen(80);
