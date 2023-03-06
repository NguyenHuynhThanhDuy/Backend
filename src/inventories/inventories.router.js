const express = require('express');
const {
    createInventory,
    updateInventory,
    deleteInventory,
    getInventorys,
    getInventory
} = require('./Inventories.controller');
const authorization = require("../core/auth.middleware");

const router = express.Router();
router.get('/', authorization(['admin']), getInventorys);
router.get('/:id', getInventory);
router.post('/', createInventory);
router.put('/:id', updateInventory);
router.delete('/:id', deleteInventory);

module.exports = router;