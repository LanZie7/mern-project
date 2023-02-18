const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"
        if(!token) {
            return res.status(401).json({ message: 'There is no authorization' })
        }

        // Раскодирование токена
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded // Раскодированный токен кладем в объект req в поле user
        next()

    } catch (error) {
        res.status(401).json({ message: 'There is no authorization' })
    }
}