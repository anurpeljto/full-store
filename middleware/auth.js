const {UnauthorizedError} = require('../errors/index');
const jwt = require('jsonwebtoken');
const authMiddleware = async(req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization){
        throw new UnauthorizedError('Missing token');
    }

    const token = authorization.split(' ')[1];
    try {
        const payload = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id: payload.userID, first_na: payload.first_name};
        next();
    } catch (error) {
        throw new UnauthorizedError('User not authorized/authenticated');
    }
}

module.exports = authMiddleware;