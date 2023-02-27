const connectDB = require('../core/database');
const Joi = require('joi');
const authService = require('./auth.service');
const { BadRequest } = require('http-errors');
const { validate } = require('../core/utils/validate.utils');

async function signup(req, res, next) {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
            fullname: Joi.string().max(255).required(),
            birthday: Joi.date(),
            gender: Joi.string().default('male'),
            address: Joi.string().max(255).default(null),
            numberPhone: Joi.string().min(10).max(11),
        });
        const value = validate(req.body, schema);
        await authService.signup(value);
        return res.json(201).send();

    } catch (error) {
        return next(error);
    }
}


async function signin(req, res, next) {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
        });
        const value = validate(req.body, schema);

        const user = await authService.signin(value);
        return res.status(200).json(user);


    } catch (error) {
        return next(error);
    }
}

module.exports = {
    signup,
    signin
}