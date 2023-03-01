const jwt = require("jsonwebtoken");
const { Unauthorized, Forbidden } = require('http-errors');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

function authorization(roles) {
    return verifyToken = (req, res, next) => {
        const token =
            req.body.token || req.query.token || req.headers.authorization;

        if (!token || !token.startsWith('Bearer')) {
            throw new Unauthorized('Token schema is invalid or missing');
        }

        try {
            const accessToken = token.replace('Bearer ', '');
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY, { ignoreExpiration: false });
            if (roles.length && !roles.some((role) => role === decoded.role)) {
                throw new Forbidden('Forbidden accessible');
            }
            req.user = decoded;
            return next();
        } catch (error) {
            const err = new Unauthorized(error.message)
            next(err)
        }

    };
}

module.exports = authorization;