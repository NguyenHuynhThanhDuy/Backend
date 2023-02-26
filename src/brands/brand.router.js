const express = require('express');
const {
    createBrand,
    updateBrand,
    getBrand,
    deleteBrand
} = require('./brand.controller');

const router = express.Router();

router.post('/', createBrand);
router.put('/:id', updateBrand);
router.get('/:id', getBrand);
router.delete('/:id', deleteBrand);

module.exports = router;