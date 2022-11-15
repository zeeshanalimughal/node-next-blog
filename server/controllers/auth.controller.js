const User = require('../models')
const ErrorHandler = require('../middlewares/ErrorHandler')

const register = async (req, res, next) => {
    try{
        if(!req.params.id){
            next(ErrorHandler.unAuthorized(401,'Not found Id'))
        }else{
            return res.json("Hello")
        }
    }catch(err){
        next(err)
    }
}







module.exports = { register }