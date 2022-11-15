const ErrorHandler = require('./ErrorHandler')
module.exports = (err, req, res, next) => {
    if (err instanceof ErrorHandler) {
        return res.status(err.status).json({
            error: {
                message: err.message,
                status: err.status
            }
        });

    } else {
        return res.status(500).json({
            error: {
                message: err.message,
                status: err.status
            }
        });
    }
}