const express = require('express');
const { Roles } = require('../core/constant');
const authorization = require('../core/auth.middleware');
const {
    createBill,
    getBill,
    getBills,
    acceptBill
} = require('./bill.controller');

const router = express.Router();

router.post('/', authorization(['customer']), createBill);
router.get('/:id', getBill);
router.get('/', getBills);
router.put('/:id', acceptBill);

module.exports = router;