class ErrorHandler extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }

    static alreadyExists(statusCode, message) {
        return new ErrorHandler(statusCode, message)
    }
    static wrongCredentials(statusCode, message = "Username or password is incorrect!") {
        return new ErrorHandler(statusCode, message)
    }
    static unAuthorized(statusCode, message = "Unauthorized Action") {
        console.log("SDdsds")
        return new ErrorHandler(statusCode, message)
    }
    static notFound(statusCode, message = "404 Not Found") {
        return new ErrorHandler(statusCode, message)
    }
    static serverError(statusCode=500, message = "Internal server error") {
        return new ErrorHandler(statusCode, message)
    }
}




module.exports =  ErrorHandler;