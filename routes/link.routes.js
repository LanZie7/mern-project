const {Router} = require('express')
const Link = require('../models/Link')
const config = require('config')
const shortid = require('shortid')
const authMiddleware = require('../middleware/auth.middleware')
const router = Router()


// Генерация ссылок

router.post('/generate', authMiddleware, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl')
        const {from} = req.body // Получаем с фронта путь (объект from), откуда мы делаем ссылку

        const code = shortid.generate()

        const existing = await Link.findOne({ from })

        if (existing) {
            return res.json({ link: existing })
        }

        // Формируем сокращенную ссылку
        const to = baseUrl + '/t/' + code
        const link = new Link({
            code, to, from, owner: req.user.userId
        })

        await link.save()
        res.status(201).json({ link })
    } catch (e) {
        res.status(500).json({ message: 'Something wrong. Try again!' })
    }
})

router.get('/', authMiddleware, async (req, res) => {
    try {
        const links = await Link.find({ owner: req.user.userId })
        res.json(links)
        } catch (e) {
            res.status(500).json({ message: 'Something wrong. Try again!' })
        }
})

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id)
        res.json(link)
    } catch (e) {
        res.status(500).json({ message: 'Something wrong. Try again!' })
    }
})

module.exports = router