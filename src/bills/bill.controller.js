const Joi = require('joi');
const billService = require('./bill.service');
const { BadRequest } = require('http-errors');
const { validate } = require('../core/utils/validate.utils');
const { OrderStates, BillStatus } = require('../core/constant')

async function createBill(req, res, next) {
    try {
        const schema = Joi.object({
            userId: Joi.number(),
            customerName: Joi.string().required(),
            address: Joi.string().required(),
            numberPhone: Joi.string().required(),
            states: Joi.string().default(OrderStates.WAITING),
            status: Joi.string().default(BillStatus.UNPAID),
            shippingFee: Joi.number().default(15000),
            details: Joi.array().items({
                count: Joi.number().required(),
                price: Joi.number().required(),
                productId: Joi.number().required(),
            }).min(1).required(),
        })
        let createBill = {
            ...req.body
        };
        if (req.user) {
            createBill.userId = req.user.id;
        }
        const value = validate(createBill, schema);
        const result = await billService.createBill(value);
        return res.status(201).send(result);
    } catch (error) {
        return next(error);
    }
}

async function getBills(req, res, next) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(1).min(1),
            limit: Joi.number().default(5).max(10),
            sort: Joi.string().allow(''),
            sortBy: Joi.string().valid(...Object.values(['asc', 'desc'])).allow(''),
            states: Joi.array().items(Joi.string().valid(...Object.values({ ...OrderStates }))),
            shipperId: Joi.number(),
            numberPhone: Joi.string().allow(''),
            customerName: Joi.string().allow('')
        })
        const value = validate(req.query, schema);
        const result = await billService.getBills(value);
        return res.status(200).send(result);
    } catch (error) {
        return next(error)
    }
}

async function getBill(req, res, next) {
    try {
        const result = await billService.getBill(req.params.id);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

async function acceptBill(req, res, next) {
    try {
        const schema = Joi.object({
            states: Joi.string().required(),
            status: Joi.string().default(BillStatus.UNPAID)
        })
        const value = validate(req.body, schema);
        const result = await billService.acceptBill(req.params.id, value);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}

async function getHistory(req, res, next) {
    try {
        const schema = Joi.object({
            page: Joi.number().default(1).min(1),
            limit: Joi.number().default(5).max(10),
            states: Joi.array().items(Joi.string().valid(...Object.values({ ...OrderStates }))),
            userId: Joi.number().required()
        });
        const value = validate(req.query, schema);
        const result = await billService.getHistory(value);
        return res.status(200).send(result);
    } catch (error) {
        return next(error);
    }
}



module.exports = {
    createBill,
    getBills,
    getBill,
    acceptBill,
    getHistory
}