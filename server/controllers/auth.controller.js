const { User } = require('../models');
const ErrorHandler = require('../middlewares/ErrorHandler');
const { registarAccountValidation, loginAccountValidation, refreshTokenValidation } = require('../utils/validator');
const { NODE_ENV } = require('../config');
const { ALREADY_EXISTS, CREATED_SUCCESS, WRONG_CREDENTIALS, LOGIN_SUCCESS, NOT_FOUND } = require('../constant');
const bcryptjs = require('bcryptjs');
const { generateTokens } = require('../utils/generateToken');
const { validateObjectId } = require('../utils/validateObjectId');
const register = async (req, res, next) => {
    try {
        const error = registarAccountValidation(req.body)
        if (error?.details) {
            const err = NODE_ENV !== 'production' ? error?.details : error?.details[0]?.message
            return next(new ErrorHandler(401, err))
        }
        const { email, password,username,fullname } = req.body

        const userExists = await User.findOne({ email })
        if (userExists) {
            return next(ErrorHandler.alreadyExists(ALREADY_EXISTS.statusCode, "Account " + ALREADY_EXISTS.message))
        }
        const salt = bcryptjs.genSaltSync(10)
        const hashPassword = await bcryptjs.hash(password, salt);
        const user = await User.create({ username,fullname, password: hashPassword })
        if (user) {
            generateTokens(user).then(tokens => {
                return res.cookie("access_token", tokens.accessToken, {
                    httpOnly: true,
                    secure: NODE_ENV === "production",
                }).json({ messages: "Account " + CREATED_SUCCESS.message, tokens, status: CREATED_SUCCESS.statusCode })
            }).catch(err => {
                return next(ErrorHandler.serverError(500, err.message))
            })
        } else {
            return next(ErrorHandler.serverError())
        }
    } catch (err) {
        next(err)
    }
}






const login = async (req, res, next) => {
    try {
        const error = loginAccountValidation(req.body)
        if (error?.details) {
            const err = NODE_ENV !== 'production' ? error?.details : error?.details[0]?.message
            return next(new ErrorHandler(401, err))
        }
        const { email, password } = req.body

        const user = await User.findOne({ email }).lean().exec();
        if (!user) {
            return next(ErrorHandler.wrongCredentials(WRONG_CREDENTIALS.statusCode, WRONG_CREDENTIALS.message))
        }

        if (user && await bcryptjs.compare(password, user.password)) {
            generateTokens(user).then(tokens => {
                return res.cookie("access_token", tokens.accessToken, {
                    httpOnly: true,
                    secure: NODE_ENV === "production",
                }).json({ messages: "Account " + LOGIN_SUCCESS.message,id:user._id, tokens, status: LOGIN_SUCCESS.statusCode })
            }).catch(err => {
                return next(ErrorHandler.serverError(500, err.message))
            })
        } else {
            return next(ErrorHandler.wrongCredentials(WRONG_CREDENTIALS.statusCode, WRONG_CREDENTIALS.message))
        }
    } catch (err) {
        next(err)
    }
}







const refreshTokens = async (req, res, next) => {
    try {
        const { id: userId } = req.params
        if (req.params.id === undefined) {
            return next(new ErrorHandler(401, "User id is required"))
        }
        if (!validateObjectId(userId)) {
            return next(new ErrorHandler(400, "Provide a valid user id"))
        }
        const user = await User.findOne({ _id: userId }).lean().exec();
        if (!user) {
            return next(ErrorHandler.notFound(NOT_FOUND.statusCode, NOT_FOUND.message))
        }
        const error = refreshTokenValidation({ refreshToken: user.refreshToken })
        if (error?.details) {
            const err = NODE_ENV !== 'production' ? error?.details : error?.details[0]?.message
            return next(new ErrorHandler(401, err))
        }
        generateTokens(user).then(tokens => {
            return res.status(200).cookie("access_token", tokens.accessToken, {
                httpOnly: true,
                secure: NODE_ENV === "production",
            }).json({status:200, tokens })
        }).catch(err => {
            return next(ErrorHandler.serverError(500, err.message))
        })
    } catch (err) {
        next(err)
    }
}





const logout = async (req, res, next) => {
    try {
        return res.clearCookie("access_token")
        .status(200)
        .json({ message: "Successfully logged out" });
    } catch (err) {
        next(err)
    }
}


module.exports = { register, login,logout, refreshTokens }