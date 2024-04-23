const express = require('express')
const {ExecCode, ExecProblem} = require('./src/splitter')
const cors = require('cors')
const app = express()
const port = 7070

app.use(express.json())
app.use(cors())

app.post('/code', async (req, res) => {
  try{
    const {source, username, language, stdin} = req.body
    // TO-DO: check if they're missing
    const results = await ExecCode(source, username, language, stdin || null)
    res.status(200).json({...results})
  }
  catch(e){
    console.log(e)
    res.status(200).json({reqError: e.toString()})
  }
})

app.post('/problem', async (req, res) => {
  try{
    const {source, username, language, files, tests} = req.body
    // TO-DO: check if they're missing
    const results = await ExecProblem(source, username, language, files, tests)
    res.status(200).json({...results})
  }
  catch(e){
    res.status(200).json({reqError: e.toString()})
  }
})

app.listen(port, () => {
  console.log(`Code runner running on port: ${port}`)
})
