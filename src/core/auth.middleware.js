const jwt = require("jsonwebtoken");
const { Unauthorized, Forbidden } = require('http-errors');
const express = require('express');
const dotenv = require('express');
dotenv.config();

function authorization(roles) {
    const verifyToken = (req, res, next) => {
        const token =
            req.body.token || req.query.token || req.headers["x-access-token"];

        if (!token || !token.startsWith('Bearer')) {
            throw new Unauthorized('Token schema is invalid or missing');
        }

        try {
            const accessToken = token.replace('Bearer ', '');
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
            req.user = decoded;
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
        return next();
    };
}

module.exports = verifyToken;