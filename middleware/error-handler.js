const {CustomError} = require('../errors/index');
const {StatusCodes} = require('http-status-codes');

const errorMiddleware = (err, req, res, next) => {
    let customErr =   {
        statusCode: err.statusCode || 500,
        message: err.message || 'Something went wrong'
    }

    if (err instanceof CustomError){
        return res.status(err.statusCode).json({message: err.message});
    }

    return res.status(customErr.statusCode).json({err: customErr.message});
}

module.exports = errorMiddleware;