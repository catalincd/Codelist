const fs = require('fs')

module.exports = global.config = {
    hostname: fs.readFileSync("./hostname").toString() || "http://localhost",
    port: fs.readFileSync("./port").toString() || "8080",
    fullhost: `${this.hostname}/:${this.port}`
};