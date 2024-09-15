const ProductModel = require('../models/ProductModel')
const {BadRequestError, NotFound, Unauthorized} = require('../errors/index');
const {StatusCodes} = require('http-status-codes');

class ProductsController  {
    getProducts = async (req, res) => {
        const {category} = req.query;
        
        let query = ProductModel.find().populate('category', '_id name');
        
        if(category){
            query = ProductModel.find().populate({
                path: 'category',
                match: {
                    name: category
                }
            });
        }

        const products = await query.exec();
        const filteredProduct = products.filter(product => product.category !== null);
        return res.status(StatusCodes.OK).json({product: filteredProduct});
    }

    // getProductsByCategory = async (req, res) => {
    //     const {category} = req.query;
    //     console.log(category);
    //     const products = await ProductModel.find().populate({
    //         path: "category",
    //         match: {name: category},
    //     }).exec();

    //     const filteredProducts = products.filter((product) => product.category !== null);


    //     return res.status(StatusCodes.OK).json({products: filteredProducts});
    // }

    getProduct = async(req, res) => {
        const {id} = req.params;
        const product = await ProductModel.findOne({_id: id}).populate('category', '_id name');;
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