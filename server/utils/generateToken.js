const jwt  = require("jsonwebtoken");
const {User} = require("../models")
const { ACCESS_TOKEN_JWT_SECRET, REFRESH_TOKEN_JWT_SECRET } = require('../config')

const generateTokens = async (user) => {
    try {
        const payload = { _id: user._id, isAdmin: user.isAdmin,email:user.email };
        const accessToken = jwt.sign(
            payload,
            ACCESS_TOKEN_JWT_SECRET,
            { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
            payload,
            REFRESH_TOKEN_JWT_SECRET,
            { expiresIn: "30d" }
        );

        const userExists = await User.findOne({ userId: user._id });
        if (userExists){
            await User.findByIdAndUpdate(
            {_id:user._id},
            {$set : {refreshToken}}
            );
        }
        return  Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports =  {generateTokens};