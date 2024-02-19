const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/codelist', {
    serverSelectionTimeoutMS: 1000,
    autoIndex: true
})

const Problem = require('../schemas/Problem')
const CodeRunner = require('../utils/CodeRunner')

const problemId = 2
const xcode = `#include <iostream>
using namespace std;

int main()
{
    std::cout << "Hello World!" << std::endl;
    return 0;
}`

setTimeout(async () => {
    const results = await CodeRunner.RunCode(problemId, xcode)
    console.log(results)
}, 3000)
