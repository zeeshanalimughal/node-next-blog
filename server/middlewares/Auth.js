const jwt = require('jsonwebtoken')
const { TOKEN_NOT_FOUND, INVALID_TOKEN, UNAUTHENTICATED } = require('../constant')
const { ACCESS_TOKEN_JWT_SECRET } = require('../config')
const ErrorHandler = require('../middlewares/ErrorHandler')

const varifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(TOKEN_NOT_FOUND.statusCode).json({status:TOKEN_NOT_FOUND.statusCode,message:TOKEN_NOT_FOUND.message});
    jwt.verify(token, ACCESS_TOKEN_JWT_SECRET, (err, user) => {
        if (err) return res.status(INVALID_TOKEN.statusCode).json({status:TOKEN_NOT_FOUND.statusCode,message:INVALID_TOKEN.message});
        req.user = user;
        next()
    })
}


const varifyUser = (req, res, next) => {

    varifyToken(req, res, next, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            ErrorHandler.unAuthorized(UNAUTHENTICATED.statusCode, UNAUTHENTICATED.message)
        }
    })
}


const varifyAdmin = (req, res, next) => {
    varifyToken(req, res, next, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            ErrorHandler.unAuthorized(UNAUTHENTICATED.statusCode, UNAUTHENTICATED.message)
        }
    })

}
module.exports = { varifyToken, varifyUser, varifyAdmin }
