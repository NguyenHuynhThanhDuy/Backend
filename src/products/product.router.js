const express = require('express');
const {
    createProduct,
    updateProduct,
    getProduct,
    deleteProduct,
    getProducts
} = require('./product.controller');

const { productImageUpload } = require('../core/static/image.static');

const router = express.Router();

router.post('/', productImageUpload.array('images', 2), createProduct);
router.put('/:id', productImageUpload.array('images', 2), updateProduct);
router.get('/:id', getProduct);
router.delete('/:id', deleteProduct);
router.get('/', getProducts);
module.exports = router;