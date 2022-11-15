const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

exports.registarAccountValidation = (body) => {
    const schema = Joi.object({
        username: Joi.string().required().label("User Name"),
        fullname: Joi.string().required().label("Full Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        isAdmin: Joi.boolean().truthy(true).falsy(false).sensitive(),
    })
    const {error}  =schema.validate(body)
    return error
}


exports.loginAccountValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    })
    const {error}  =schema.validate(body)
    return error

}
exports.passwordValidate = (body) => {
    const schema = Joi.object({
        oldPassword: Joi.required().label("Old Password"),
        newPassword: passwordComplexity().required().label("New Password"),
    })
    const {error}  =schema.validate(body)
    return error

}

exports.refreshTokenValidation = (body) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required().label("Refresh Token"),
    });
    const {error}  =schema.validate(body)
    return error
}
exports.validateImageFile = (body) => {
    const schema = Joi.object({
        filename: Joi.string().required().label("File"),
        path: Joi.string().required()
      });
    const {error}  =schema.validate(body)
    return error
}

