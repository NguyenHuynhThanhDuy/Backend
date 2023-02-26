const express = require('express');
const {
    createBrand,
    updateBrand,
    getBrand,
    deleteBrand,
    getBrands
} = require('./brand.controller');

const router = express.Router();

router.post('/', createBrand);
router.put('/:id', updateBrand);
router.get('/:id', getBrand);
router.delete('/:id', deleteBrand);
router.get('/', getBrands);

module.exports = router;