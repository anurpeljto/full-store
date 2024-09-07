const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        unique: true,
        validate: [isEmail, 'Email is invalid']
    },

    first_name: {
        type: String,
        required: [true, 'First name is required'],
        maxLength: 20
    },

    last_name: {
        type: String,
        required: [true, 'Last name is required'],
        maxLength: 15
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 8,
        maxLength: 15
    }
})

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePasswords = async function(inputPassword) {
    const isCorrect = await bcrypt.compare(inputPassword, this.password);
    return isCorrect;
}

UserSchema.methods.createToken = function() {
    const token = jwt.sign({first_name: this.first_name, last_name: this.last_name, userID: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
    return token;
}

module.exports = mongoose.model('User', UserSchema);