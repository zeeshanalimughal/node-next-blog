const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

exports.registarAccountValidation = (body) => {
    const schema = Joi.object({
        username: Joi.string().required().label("User Name"),
        fullname: Joi.string().required().label("Full Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
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
exports.validateBlogPostSchema = (body) => {
    const schema = Joi.object({
        title: Joi.string().required().label("Blog title"),
        slug: Joi.string().label("Blog Slug"),
        description: Joi.string().required().label("Blog Description"),
        categoryId: Joi.string().required().label("Category Id"),
        isFeatured: Joi.boolean().required().label("Is Featured"),
      });
    const {error}  =schema.validate(body)
    return error
}

