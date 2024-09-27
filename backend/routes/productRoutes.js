const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const imageUpload = require('../middleware/imageUpload');

router.post('/addProduct', imageUpload, productController.addProduct);
router.get('/getProducts', productController.getProducts);
router.get('/getProductById/:id', productController.getProductById);
router.put('/updateProduct/:id', imageUpload, productController.updateProduct);


module.exports = router;