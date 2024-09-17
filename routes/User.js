const express = require('express');
const router = express.Router();
const AuthControllerClass = require('../controllers/AuthController');


const AuthController = new AuthControllerClass();

router.route('/register').post(AuthController.register);
router.route('/login').post(AuthController.login);
router.route('/check-auth').get(AuthController.checkAuth);
router.route('/get-user').get(AuthController.getUser);

module.exports = router;