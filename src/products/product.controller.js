const Joi = require('joi');
const productService = require('./product.service');
const { BadRequest } = require('http-errors');
const { validate } = require('../core/utils/validate.utils');

async function createProduct(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            description: Joi.string().required(),
            brandId: Joi.number().required(),
            categoryId: Joi.number().required(),
            saleCodeId: Joi.number(),
            images: Joi.array().required().min(2).max(2),
            warrantyPeriod: Joi.number().required()
        });
        // let options = {};
        const value = validate({
            ...req.body,
            images: Array.isArray(req.files) && req.files.map(file => file.filename)
        }, schema);
        const imagesArr = value.images;
        delete value.images;
        const result = await productService.createProduct({
            ...value,
            img1: imagesArr[0],
            img2: imagesArr[1]
        });
        return res.status(201).send(result);
    } catch (error) {
        return next(error);
    }
}

async function updateProduct(req, res, next) {
    try {
        const schema = Joi.object({
            name: Joi.string(),
            price: Joi.number(),
            description: Joi.string(),
            brandId: Joi.number(),
            categoryId: Joi.number(),
            saleCodeId: Joi.number(),
            images: Joi.any(),
            warrantyPeriod: Joi.number()
        });

        const value = validate({
            ...req.body,
            images: Array.isArray(req.files) && req.files.map(file => file.filename)
        }, schema);
        const imagesArr = value.images;
        delete value.images;
        console.log(value);
        const result = await productService.updateProduct(req.params.id, {
            ...value,
            img1: imagesArr[0],
            img2: imagesArr[1]
        });
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

async function getProduct(req, res, next) {
    try {
        const result = await productService.getProduct(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

async function deleteProduct(req, res, next) {
    try {
        await productService.deleteProduct(req.params.id);
        return res.status(200).send();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getProduct,
    deleteProduct
}