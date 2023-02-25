const express = require('express');
const {
    createProduct,
    updateProduct
} = require('./product.controller');

const { productImageUpload } = require('../core/static/image.static');

const router = express.Router();

router.post('/', productImageUpload.array('images', 2), createProduct);
router.put('/:id', productImageUpload.array('images', 2), updateProduct);
module.exports = router;