const mongoose = require('mongoose');

const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        throw new Error('Failed to connect to database, ', error);
    }
}

module.exports = connectDB;