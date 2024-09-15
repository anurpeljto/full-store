const express = require('express');
const router = express.Router();
const ProductControllerClass = require('../controllers/productsController');
const ProductController = new ProductControllerClass();


router.route('/').get(ProductController.getProducts).post(ProductController.createProduct);
router.route('/:id').get(ProductController.getProduct).patch(ProductController.updateProduct);
// router.route('/category').get(ProductController.getProductsByCategory);

module.exports = router;