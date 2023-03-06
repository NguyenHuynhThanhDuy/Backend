const express = require('express');
const { Roles } = require('../core/constant');
const authorization = require('../core/auth.middleware');
const {
    createBill,
    getBill,
    getBills,
    acceptBill,
    getHistory
} = require('./bill.controller');

const router = express.Router();

router.post('/', authorization([Roles.CUSTOMER]), createBill);
// router.get('/:id', getBill);
router.get('/', getBills);
router.put('/:id', acceptBill);
router.get('/history', authorization([Roles.CUSTOMER]), getHistory);

module.exports = router;