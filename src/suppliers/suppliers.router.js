const express = require('express');
const {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSuppliers,
    getSupplier
} = require('./suppliers.controller');
const authorization = require("../core/auth.middleware");

const router = express.Router();
router.get('/', authorization(['admin']), getSuppliers);
router.get('/:id', getSupplier);
router.post('/', createSupplier);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

module.exports = router;