const CategoryClass = require('../controllers/categoryController');
const express = require('express');
const router = express.Router();

const CategoryController = new CategoryClass();

router.route('/').post(CategoryController.createCategory).delete(CategoryController.deleteCategory).get(CategoryController.getCategories);

module.exports = router;