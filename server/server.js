const https = require('https')
const express = require('express')
const mongoose = require('mongoose')

const auth = require('./routes/auth')
const data = require('./routes/data')
const problems = require('./routes/problems')
const articles = require('./routes/articles')
const solutions = require('./routes/solutions')
const quizzes = require('./routes/quizzes')
const courses = require('./routes/courses')

const logger = require('./utils/logs/LogManager')
const seeder = require('./utils/seeder/Seeder')

const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./utils/swagger/config');

const path = require("path");
const fs = require('fs')
const cors = require('cors')

const app = express()
const debug = parseInt(fs.readFileSync('./server/keys/debug').toString()) == 1 || false
const port = parseInt(fs.readFileSync('./server/port').toString()) || 8080
const domain = fs.readFileSync('./server/hostname').toString() || "codelist.ro"

const mongo_key = fs.readFileSync('./server/keys/mongo_key').toString()
const ssl_cert = fs.readFileSync('/keys/ssl_cert').toString()
const ssl_key = fs.readFileSync('/keys/ssl_key').toString()
const ssl_ca = fs.readFileSync('/keys/ssl_ca').toString()


const mongoDb = mongoose.connect('mongodb://localhost:27017', {
    serverSelectionTimeoutMS: 1000,
    autoIndex: true,
    user: "user",
    pass: mongo_key,
    dbName: "codelist"
})

mongoose.connection.once('open', async () => {
    seeder.onInit()
})

app.use(express.json())
app.use(cors())

app.use('/api/data', data)
app.use('/api/auth', auth)
app.use('/api/problems', problems)
app.use('/api/articles', articles)
app.use('/api/solutions', solutions)
app.use('/api/quizzes', quizzes)
app.use('/api/courses', courses)



if(debug)
{
    app.use('/images', express.static('server/build/images'))
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
    
    console.log("RUNNING IN DEBUG MODE")
    app.listen(port);
}
else
{
    logger.onInit()
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig))
    app.use('/', express.static('server/build'))
    app.use((req, res, next) => {
        res.sendFile(path.join(__dirname, "..", "server/build", "index.html"))
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
}


