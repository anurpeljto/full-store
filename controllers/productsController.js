const ProductModel = require('../models/ProductModel')
const {BadRequestError, NotFound, Unauthorized} = require('../errors/index');
const {StatusCodes} = require('http-status-codes');

class ProductsController  {
    getProducts = async (req, res) => {
        const products = await ProductModel.find({});
        return res.status(StatusCodes.OK).json({product: products});
    }

    getProduct = async(req, res) => {
        const {id} = req.query;
        const product = await ProductModel.findOne({_id: id});
        if (!id){
            throw new BadRequestError('Missing or invalid product id')
        }

        if(!product){
            throw new NotFound('Product not found');
        }

        return res.status(StatusCodes.OK).json({product: product});
    }

    createProduct = async(req, res) => {
        const product = await ProductModel.create({... req.body})
        if(!product) {
            throw new BadRequestError('Unable to create product');
        }
        return res.status(StatusCodes.OK).json({product: product});
        
    }

    updateProduct = async(req, res) => {
        const {id} = req.params;
        const newProduct = await ProductModel.findOneAndUpdate({_id: id}, {...req.body}, {new: true, runValidators: true})
        if(!newProduct){
            throw new BadRequestError('Missing product ID');
        }
        return res.status(StatusCodes.OK).json({product: product});
    }
}

module.exports = ProductsController;