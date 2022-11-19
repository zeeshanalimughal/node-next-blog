const router = require('express').Router()
const {authController,userController, blogController} = require('../controllers')
const {varifyToken,varifyUser} = require('../middlewares/Auth')

// router.use(varifyToken)


// Auth Routes
router.post('/register',authController.register)
router.post('/login',authController.login)
router.post('/change-password',varifyToken,userController.changePassword)
router.get('/refreshToken/:id?',varifyToken,varifyUser,authController.refreshTokens)
router.get('/logout',authController.logout)



// Blog Routes
router.post('/blogs/create',varifyToken,varifyUser,blogController.createBlog)
router.get('/blogs',varifyToken,varifyUser,blogController.getBlogPost)
router.get('/blogs/:slug',varifyToken,varifyUser,blogController.getSingleBlogPost)



module.exports = router