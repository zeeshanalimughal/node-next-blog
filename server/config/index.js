require('dotenv').config()
module.exports = {
    PORT,
    MONGODB_URL,
    ACCESS_TOKEN_JWT_SECRET,
    REFRESH_TOKEN_JWT_SECRET,
    LOG_FILE,
    LOG_FORMAT,
    LOG_SIZE,
    LOG_INTERVAL,
} = process.env