const {UnauthorizedError} = require('../errors/index');
const authHeaders = (req, res, next) => {
    const token = req.cookies.jwt_token;
    if(!token) {
        throw new UnauthorizedError('No token!');
    }

    try {
        req.headers['authorization'] = `Bearer ${token}`;
        next();
    } catch (error) {
        throw new UnauthorizedError('Invalid token!');
    }
}

module.exports = authHeaders;