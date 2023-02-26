const express = require('express');
const {
    createCategory,
    updateCategory,
    getCategory,
    deleteCategory,
    getCategories
} = require('./category.controller');

const router = express.Router();

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.get('/:id', getCategory);
router.delete('/:id', deleteCategory);
router.get('/', getCategories);

module.exports = router