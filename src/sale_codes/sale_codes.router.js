const express = require('express');
const {
    createSaleCode,
    updateSaleCode,
    deleteSaleCode,
    getSaleCodes,
    getSaleCode
} = require('./sale_codes.controller');
const authorization = require("../core/auth.middleware");

const router = express.Router();
router.get('/', authorization(['admin']), getSaleCodes);
router.get('/:id', getSaleCode);
router.post('/', createSaleCode);
router.put('/:id', updateSaleCode);
router.delete('/:id', deleteSaleCode);

module.exports = router;