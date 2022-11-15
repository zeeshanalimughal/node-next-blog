const router = require('express').Router()
const {authController} = require('../controllers')
const {varifyToken} = require('../middlewares/Auth')

// app.use(varifyToken)
// Auth Routes
router.post('/register',authController.register)
router.post('/login',authController.login)
router.get('/createToken/:id?',authController.refreshTokens)




module.exports = router