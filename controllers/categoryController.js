const CategoryModel = require('../models/CategoryModel');
const {BadRequestError, NotFound, Unauthorized} = require('../errors/index');
const {StatusCodes} = require('http-status-codes');

class CategoryController {
    createCategory = async(req, res) => {
        const category =  await CategoryModel.create({...req.body});
        if (!category) {
            throw new BadRequestError('Unale to create category');
        }
        return res.status(StatusCodes.CREATED).json({category:category});
    }
    deleteCategory = async(req, res) => {
        const {name} = req.query;
        const category = await CategoryModel.findOneAndDelete({name: name});

        if(!name) {
            throw new BadRequestError('Missing name of category');
        }

        return res.status(StatusCodes.OK).json({category});
    }
}

module.exports = CategoryController;