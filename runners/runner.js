const express = require('express')
const {ExecCode, ExecProblem} = require('./src/splitter')
const cors = require('cors')
const app = express()
const port = 7070

app.use(express.json())
app.use(cors())

app.post('/code', async (req, res) => {
  try{
    const {source, username, language} = req.body
    // TO-DO: check if they're missing
    const results = await ExecCode(source, username, language)
    res.status(200).json({...results, message: "something"})
  }
  catch(e){
    res.status(500).json({error: e})
  }
})

app.post('/problem', async (req, res) => {
  try{
    const {source, username, language} = req.body
    // TO-DO: check if they're missing
    const results = await ExecProblem(source, username, language)
    res.status(200).json({...results})
  }
  catch(e){
    res.status(500).json({error: e})
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
