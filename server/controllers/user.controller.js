const { User } = require('../models');
const ErrorHandler = require('../middlewares/ErrorHandler');
const { passwordValidate } = require('../utils/validator');
const { NODE_ENV } = require('../config');
const { ALREADY_EXISTS, CREATED_SUCCESS, WRONG_CREDENTIALS, LOGIN_SUCCESS, NOT_FOUND, UNAUTHENTICATED, PASSWORD_CHANGED, SERVER_ERROR } = require('../constant');
const bcryptjs = require('bcryptjs');
const { validateObjectId } = require('../utils/validateObjectId');





const changePassword = async (req, res, next) => {
    try {
        const error = passwordValidate(req.body)
        if (error?.details) {
            const err = NODE_ENV !== 'production' ? error?.details : error?.details[0]?.message
            return next(new ErrorHandler(401, err))
        }
        const {oldPassword, newPassword } = req.body
     
        const user = await User.findOne({ _id: req.user._id }).lean().exec();
        if (!user) {
            return next(ErrorHandler.unAuthorized(UNAUTHENTICATED.statusCode, UNAUTHENTICATED.message))
        }

        if (user && await bcryptjs.compare(oldPassword, user.password)) {

            if(oldPassword === newPassword){
                return next(new ErrorHandler(400,"New password cannot be your old password"))
            }

            const newHashedPassword = await bcryptjs.hash(newPassword, 10)
            await User.findByIdAndUpdate({ _id: user._id },
                { $set: { password: newHashedPassword } }).then(() => {
                    return res.json({ messages: PASSWORD_CHANGED.message, status: PASSWORD_CHANGED.statusCode })
                }).catch(err =>{
                    return next(ErrorHandler.serverError(SERVER_ERROR.statusCode,SERVER_ERROR.message))
                })
        } else {
            return next(ErrorHandler.wrongCredentials(WRONG_CREDENTIALS.statusCode, WRONG_CREDENTIALS.message))
        }
    } catch (err) {
        next(err)
    }
}





module.exports = { changePassword }