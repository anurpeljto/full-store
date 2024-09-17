const {UnauthorizedError} = require('../errors/index');
const jwt = require('jsonwebtoken');
const authMiddleware = async(req, res, next) => {
    // const {authorization} = req.headers;

    // if(!authorization || !authorization.startsWith('Bearer')){
    //     throw new UnauthorizedError('Authentication invalid');
    // }

    // const token = authorization.split(' ')[1];
    const token = req.cookies.jwt_token;
    if(!token) {
        throw new UnauthorizedError('Authentication invalid');
    }
    try {
        const payload = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id: payload.userID, first_na: payload.first_name};
        next();
    } catch (error) {
        return new UnauthorizedError('User not authorized/authenticated');
    }
}

module.exports = authMiddleware;