const express = require('express')
const router = express.Router()

const { JSDOM } = require('jsdom')
const dompurify = require('dompurify')

const User = require('../schemas/User')
const ConfigManager = require('../utils/ConfigManager')

const apiAuth = require('../middlewares/apiAuth')
const Article = require('../schemas/Article')

router.use((req, res, next) => {
    // console.log('Data Req: ', Date.now())
    next()
})

router.post('/', apiAuth, async (req, res) => {
    try {
        const { name, preview, text } = req.body

        const searchedArticle = await Article.findOne({ name })
        if (searchedArticle) {
            return res.status(409).json({ error: 'ARTICLE_NAME_ALREADY_USED' })
        }

        const id = await ConfigManager.GetNewArticleId()


        const newArticle = new Article({id, name, preview, text: sanitizeArticleText(text), creator: req.user.username})
        await newArticle.save()

        res.status(201).json({ message: 'ARTICLE_REGISTER_SUCCESS', id })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'ARTICLE_SERVER_ERROR' })
    }
})

router.get('/', async (req, res) => {
    try {
        if (!(req.query.id)) {
            return res.status(406).json({ error: 'ID_OR_FILTER_NOT_FOUND' })
        }

        const searchedArticle = await Article.findOne({ id: req.query.id })

        if (!searchedArticle) {
            return res.status(404).json({ error: 'ARTICLE_NOT_FOUND' })
        }

        searchedArticle.views += 1
        searchedArticle.save()

        res.status(200).json(searchedArticle)
    }
    catch (error) {
        res.status(500).json({ error: 'ARTICLE_SERVER_ERROR' })
    }
})

router.get('/homescreen', async (req, res) => {
    try {
        var searchedArticles = (await Article.find({}).limit(5)) || []
        res.status(200).json(searchedArticles)
    }
    catch (error) {
        res.status(500).json({ error: 'ARTICLE_SERVER_ERROR' })
    }
})


const sanitizeArticleText = (text) => {
    const jsdomInstance = new JSDOM("").window;
    const dompurifyInstance = dompurify(jsdomInstance);
    return dompurifyInstance.sanitize(text);
}

module.exports = router

