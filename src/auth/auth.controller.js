const connectDB = require('../core/database');
const Joi = require('joi');
const authService = require('./auth.service');
const { BadRequest } = require('http-errors');
const { validate } = require('../core/utils/validate.utils');
const { Roles, Gender } = require('../core/constant')


async function signup(req, res, next) {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),
            fullname: Joi.string().max(255).required(),
            birthday: Joi.date(),
            gender: Joi.string().default(Gender.MALE),
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

async function forgotPassword(req, res, next) {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required()
        })
        const value = validate(req.body, schema);
        await authService.forgotPassword(value);
        return res.status(200).send();
    } catch (error) {
        return next(error);
    }
}
async function resetPassword(req, res, next) {
    try {
        const schema = Joi.object({
            id: Joi.number().required(),
            password: Joi.string().required(),
            token: Joi.string().required(),
        });

        const value = validate(req.body, schema);

        await authService.resetPassword(value);
        return res.status(200).send();

    } catch (error) {
        return next(error);
    }
}

async function getUserFromGG(req, res, next) {
    try {
        const result = await authService.getUserFromGG(req.user);
        res.cookie('Token', result.accessToken, {});
        res.cookie('user', JSON.stringify(result.information), {})
        res.redirect('http://localhost:3000')
    } catch (error) {
        return next(error);
    }
}

async function confirmAccount(req, res, next) {
    try {
        const schema = Joi.object({
            email: Joi.string().required(),
            otp: Joi.number().required(),
        });

        const value = validate(req.body, schema);

        await authService.confirmAccount(value)
        res.status(200).send();
    } catch (error) {
        return next(error);
    }
}

async function resendOTP(res, req, next) {
    try {
        const schema = Joi.object({
            email: Joi.string().required(),
        });

        const value = validate(req.body, schema);

        await authService.resendOTP(value)
        res.status(200).send();
    } catch (error) {
        return next(error);
    }
}
module.exports = {
    signup,
    signin,
    forgotPassword,
    resetPassword,
    getUserFromGG,
    confirmAccount,
    resendOTP
}