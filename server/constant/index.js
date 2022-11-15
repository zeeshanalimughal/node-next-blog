const ErrorMessages = {
    ALREADY_EXISTS: { statusCode: 409, message: 'Already Esists' },
    WRONG_CREDENTIALS: { statusCode: 401, message: 'Wrong Credentials' },
    UNAUTHENTICATED: { statusCode: 401, message: 'Unauthorizes Action' },
    TOKEN_NOT_FOUND: { statusCode: 401, message: 'Not Authenticated' },
    INVALID_TOKEN: { statusCode: 403, message: 'Token Is Not Valid' },
    NOT_FOUND: { statusCode: 404, message: '404 Not Found' },
    SERVER_ERROR: { statusCode: 500, message: '500 | Internal Server Error' }
}

module.exports = ErrorMessages