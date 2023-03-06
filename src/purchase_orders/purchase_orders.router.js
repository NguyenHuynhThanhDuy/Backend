const express = require('express');
const {
    createPurchaseOrder,
    getPurchaseOrders,
    getPurchaseOrder
} = require('./purchase_orders.controller');
const authorization = require("../core/auth.middleware");

const router = express.Router();

router.get('/', getPurchaseOrders);
router.get('/:id', getPurchaseOrder);
router.post('/', authorization(['admin']), createPurchaseOrder);

module.exports = router;