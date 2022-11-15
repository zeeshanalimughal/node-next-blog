const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

const registarAccountValidation = (body) => {
    const schema = Joi.object({
        username: Joi.string().required().label("User Name"),
        fullname: Joi.string().required().label("Full Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
        isAdmin: Joi().boolean().truthy(true).falsy(false).sensitive(),
    })
    return schema.validate(body)
}


const loginAccountValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    })
    return schema.validate(body)

}

const refreshTokenValidation = (body) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required().label("Refresh Token"),
    });
    return schema.validate(body);
}


export {
    registarAccountValidation,
    loginAccountValidation,
    refreshTokenValidation,
};