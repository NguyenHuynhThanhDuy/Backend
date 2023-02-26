const Joi = require('joi');
const categoryService = require('./category.service');
const { BadRequest } = require('http-errors');
const { validate } = require('../core/utils/validate.utils');

async function createCategory(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string().required()
        })
        const value = validate(req.body, schema);
        const result = await categoryService.createCategory(value);
        return res.status(201).send(result);
    } catch (error) {
        return next(error);
    }
}

async function updateCategory(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string().required()
        })
        const value = validate(req.body, schema);
        const result = await categoryService.updateCategory(req.params.id, value);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

async function getCategory(req, res, next) {
    try {
        const result = await categoryService.getCategory(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

async function deleteCategory(req, res, next) {
    try {
        await categoryService.deleteCategory(req.params.id);
        return res.status(200).send();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createCategory,
    updateCategory,
    getCategory,
    deleteCategory
}