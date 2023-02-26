const connectDB = require('../core/database.js');
const db = require('../models/index');
const { BadRequest } = require('http-errors');

async function createCategory(body) {
    const category = await db.Category.create(body);
    return category;
}

async function updateCategory(id, body) {
    const category = await db.Category.findOne({
        where: { id: id }
    });
    if (!category) throw new BadRequest('Category not found');
    const result = await category.update({ ...body });
    return result;
}

async function getCategory(id) {
    const category = await db.Category.findOne({
        where: { id: id }
    });
    if (!category) throw new BadRequest('Category not found');
    return category;
}

async function deleteCategory(id) {
    const category = await db.Category.findOne({
        where: { id: id }
    });
    if (!category) throw new BadRequest('Category not found');
    await category.destroy();
}


module.exports = {
    createCategory,
    updateCategory,
    getCategory,
    deleteCategory
}