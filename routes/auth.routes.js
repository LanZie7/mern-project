const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth
router.post(
    '/register', 
    // Добавляем массив валидаторов
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Minimum password length is 6 characters').isLength({ min: 6 }),
    ],
    async (req, res) => {
    try {
        // express-validator валидирует входящие поля
        const errors = validationResult(req)

        // Отправка ответа на фронт
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect authentication data'
            })
        }

        const {email, password} = req.body

        // Логика регистрации
        const candidate = await User.findOne({ email })

        if(candidate) {
            return res.status(400).json({ message: 'This user already exists' })
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({ email, password: hashedPassword })

        // Ждём, пока пользователь сохранится
        await user.save()

        res.status(201).json({ message: 'User has been created!' })

    } catch (e) {
        res.status(500).json({ message: 'Something wrong. Try again!' })
    }
})

router.post(
    '/login',
    // Добавляем массив валидаторов
    [
        check('email', 'Enter the correct email').normalizeEmail().isEmail(),
        check('password', 'Enter the password').exists()
    ],
    async (req, res) => {
    try {
        // express-validator валидирует входящие поля
        const errors = validationResult(req)

        // Отправка ответа на фронт
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect login data'
            })
        }

        const {email, password} = req.body

        const user = await user.findOne({ email })

        if(!user) {
            return res.status(400).json({ message: 'User is not found' })
        }

        // После того, как пользователь найден, мы проверяем совпадают ли пароли
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid password. Try again!' })
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        )

        res.json({ token, userId: user.id })
        

    } catch (e) {
        res.status(500).json({ message: 'Something wrong. Try again!' })
    }
})

module.exports = router