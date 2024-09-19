const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnauthorizedError} = require('../errors/index');
const jwt = require ('jsonwebtoken');

const UserModel = require('../models/UserModel');
class AuthController {
    register = async(req, res) => {
        const {email} = req.body;
        const existingUser = await UserModel.findOne({email: email});

        if(existingUser){
            throw new BadRequestError('User already exists');
        }
        const user = await UserModel.create({...req.body});
        if(!user) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, msg: 'Failed to create user'});
        }
        const token = await user.createToken();

        res.cookie('jwt_token', token, {
            httpOnly: true,
            maxAge: 3600000,
            path: '/',
            sameSite: 'none'
        });
        return res.status(StatusCodes.CREATED).json({success: true, user: user, token: token});
    }

    login = async(req, res) => {
        const {email, password} = req.body;

        const user = await UserModel.findOne({email: email});
        if(!user){
            throw new BadRequestError('User does not exist');
        }

        const response = await user.comparePasswords(password);
        if(!response) {
            throw new BadRequestError('Incorrect password');
        }
        const token = user.createToken();
        let first_name = '';
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            first_name = decodedToken.first_name;
        })
        res.cookie('jwt_token', token, {
            httpOnly: true,
            maxAge: 3600000,
            path: '/',
            sameSite: 'none'
        });
        return res.status(StatusCodes.OK).json({success: true, msg: 'Successfully logged in', token, first_name});
    }

    removeUser = async(req, res) => {
        const {email} = req.body;
        const user = await UserModel.findOneAndDelete({email: email});

        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({success: false, msg: 'User not found'});
        }
        return res.status(StatusCodes.OK).json({success: true, user: user});
    }

    modifyUser = async(req, res) => {
        const {email: userEmail} = req.body;
        const user = await UserModel.findOneAndUpdate({email: userEmail}, req.body, {runValidators: true, new: true})
        return res.status(StatusCodes.OK).json({success: true, user: user});
    }

    checkAuth = async(req, res) => {
        console.log(req.cookies);
        const token = req.cookies.jwt_token;
        if(token){
            jwt.verify(token, process.env.JWT_SECRET, (err) => {
                if(err){
                    return res.status(StatusCodes.BAD_REQUEST).json({authenticated: false});
                }
                return res.status(StatusCodes.OK).json({authenticated: true});
            
            })
        } else {
            return res.status(401).json({ authenticated: false });
        }
    }

    getUser = async(req, res) => {
        const token = req.cookies.jwt_token;
        if(!token) {
            throw new UnauthorizedError('No token found!');
        }
        const user = jwt.decode(token);
        res.status(200).json({success: true, user});
    }
}

module.exports = AuthController;