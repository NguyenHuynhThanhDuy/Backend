const express = require('express');
const {
    createSaleCode,
    updateSaleCode,
    deleteSaleCode,
} = require('./sale_codes.controller');
const authorization = require("../core/auth.middleware");

const router = express.Router();

router.post('/', createSaleCode);
router.put('/:id', updateSaleCode);
router.delete('/:id', deleteSaleCode);

module.exports = router;