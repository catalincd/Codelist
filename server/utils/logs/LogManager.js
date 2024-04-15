const fs = require("fs")
const path = require("path")
const { format } = require('date-fns');
const logsPath = "server/logs"
const memoryLimit = 100 * 1024 * 1024 // 100MB

var currentLog = ""
var logStream = null

const getLogFiles = () => {
    const fileNames = fs.readdirSync(logsPath)
    const absFileNames = fileNames.map(file => path.join(logsPath, file))
    const files = absFileNames.map(file => ({name: file, size: fs.statSync(file).size, date: fs.statSync(file).mtime.getTime()}))
    const sortedFiles = files.sort((a, b) => (a.date - b.date))
    return sortedFiles
}

const getTotalFilesSize = (files) => files.reduce((sum, file) => sum + file.size, 0)

const deleteOutOfMemoryLogs = () => {
    let files = getLogFiles()
    while(getTotalFilesSize(files) > memoryLimit)
    {
        fs.unlinkSync(files[0].name)
        files.shift()
    }
}

const getCurrentLogName = () => path.join(logsPath, `${format(new Date(), 'dd-MM-yyyy')}.log`)

const onUpdate = (tick = 2500) => {
    const newLog = getCurrentLogName()

    if(currentLog != newLog) {
        if(logStream) logStream.end()
        currentLog = newLog
        logStream = fs.createWriteStream(currentLog, { flags: 'a' });
    }


    deleteOutOfMemoryLogs()
    setTimeout(() => onUpdate, tick)
}

const onInit = (redirConsole = true, tick = 2500) => {
    onUpdate(2500)

    if(redirConsole)
        console.log = (obj) => log(obj)
} 
const logStr = (str) => logStream.write(`${str}\n`)

const log = (obj) => {
    if(typeof obj === 'string') return logStr(obj)

    logStr(JSON.stringify(obj))
}

module.exports = {onInit, onUpdate, log, logStr}