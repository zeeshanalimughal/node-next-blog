import jwt from "jsonwebtoken";
import Token from "../models";
const { ACCESS_TOKEN_JWT_SECRET, REFRESH_TOKEN_JWT_SECRET } = require('../config')

const generateTokens = async (user) => {
    try {
        const payload = { _id: user._id, roles: user.roles };
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

        const userToken = await Token.findOne({ userId: user._id });
        if (userToken) await userToken.remove();

        await new Token({ userId: user._id, token: refreshToken }).save();
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

export default generateTokens;