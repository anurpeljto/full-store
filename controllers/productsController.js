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

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        let totalProductsQuery = ProductModel.find();
        if (category) {
            totalProductsQuery = totalProductsQuery.populate({
                path: 'category',
                match: { name: category },
            });
        }

        let allProducts = await totalProductsQuery.exec();
        allProducts = allProducts.filter((product) => product.category !== null);
        const totalProducts = allProducts.length;

        let products = await query.exec();
        products = products.filter((product) => product.category !== null);

        const numOfPages = Math.ceil(totalProducts / limit); 

        return res.status(StatusCodes.OK).json({product: products, numOfPages});
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