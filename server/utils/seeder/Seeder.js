const fs = require("fs")

const ConfigManager = require('../../utils/ConfigManager')
const Problem = require('../../schemas/Problem')

const onInit = () => {
    try {
        const seedActivated = parseInt(fs.readFileSync('./server/keys/seed').toString()) == 1 || false

        if (seedActivated) {
            seedProblems()
        }
    }
    catch (e) {
        console.log(e)
    }
}

const seedProblems = async () => {
    files = fs.readdirSync("./server/utils/seeder/problems")
    
    for(var i=0;i<files.length;i++){
        const file = files[i]
        if(file.indexOf(".json") > 0){
            let content = fs.readFileSync("./server/utils/seeder/problems/" + file, 'utf8')
            try
            {
                const problemData = JSON.parse(content)
                const id = await ConfigManager.GetNewProblemId()
                const problem = new Problem({...problemData, id, creator: "codelist"})
                await problem.save()
                console.log(`Created problem ${file}`)
            }
            catch(e){
                console.log(e)
            }
        }
    }
}



module.exports = { onInit }