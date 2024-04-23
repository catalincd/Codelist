const fs = require("fs")

const ConfigManager = require('../../utils/ConfigManager')
const User = require('../../schemas/User')
const Article = require('../../schemas/Article')
const Problem = require('../../schemas/Problem')

const onInit = () => {
    try {
        const seedActivated = parseInt(fs.readFileSync("./server/keys/seed").toString()) == 1 || false

        if (seedActivated) {
            console.log("SEEDING DATABASE")
            fs.writeFileSync("./server/keys/seed", "0")
            seedDatabase()
        }
    }
    catch (e) {
        console.log(e)
    }
}

const seedDatabase = async () => {
    await clearDatabase()
    await seedUsers()
    await seedProblems()
    await seedArticles()
}

const clearDatabase = async () => {
    await User.deleteMany({})
    await Article.deleteMany({})
    await Problem.deleteMany({})
}

const seedUsers = async () => {
    const codelistUser = new User({ id: 0, username: "codelist", email: "codelist@codelist.ro", password: "-", description: `Codelist user #${0}` })
    await codelistUser.save()
    console.log(`Created user ${"codelist"}`)

    const testerUser = new User({ id: 1, username: "tester", email: "tester@codelist.ro", password: "$2b$10$.J5j4yVgn9qIXPVljJf7Uea5kD9tprSFX6zt//hkGAxrPhgkDhAnO", description: `Codelist user #${0}`, activated: true })
    await testerUser.save()
    console.log(`Created user ${"tester"}`)
}



const seedProblems = async () => {
    const codelistUser = await User.findOne({id: 0})
    const files = fs.readdirSync("./server/utils/seeder/problems")
    const problems = []
    
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
                problems.push(id)
            }
            catch(e){
                console.log(e)
            }
        }
    }
    codelistUser.uploadedProblems = problems
    await codelistUser.save()
}

const seedArticles = async () => {
    const codelistUser = await User.findOne({id: 0})
    const files = fs.readdirSync("./server/utils/seeder/articles")
    const articles = []
    
    for(var i=0;i<files.length;i++){
        const file = files[i]
        if(file.indexOf(".json") > 0){
            let content = fs.readFileSync("./server/utils/seeder/articles/" + file, 'utf8')
            try
            {
                const articleData = JSON.parse(content)
                const id = await ConfigManager.GetNewArticleId()
                const article = new Article({...articleData, id, creator: "codelist"})
                await article.save()
                console.log(`Created article ${file}`)
                articles.push(id)
            }
            catch(e){
                console.log(e)
            }
        }
    }
    codelistUser.uploadedArticles = articles
    await codelistUser.save()
}





module.exports = { onInit }