const express = require('express');
const {
    signup,
    signin
} = require('./auth.controller');
const authorization = require("../core/auth.middleware");

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);


module.exports = router;