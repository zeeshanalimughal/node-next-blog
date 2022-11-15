const router = require('express').Router()
const {authController} = require('../controllers')
const {varifyToken} = require('../middlewares/Auth')

// app.use(varifyToken)
// Auth Routes
router.get('/register',authController.register)




module.exports = router