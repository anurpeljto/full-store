require('dotenv').config();
const mongoose = require('mongoose');
const ProductsModel = require('./models/ProductModel');
const mock = require('./mock.json');

const populateDB = async() => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        await ProductsModel.deleteMany({});
        await ProductsModel.insertMany(mock);
        console.log('Success');
    } catch (error) {
        throw new Error('Failed to connect to database, ', error);
    }
}
populateDB();
