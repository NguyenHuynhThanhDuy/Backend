const express = require('express');
const {
    signup,
    signin,
    forgotPassword
} = require('./auth.controller');
const { sendMail } = require('../core/utils/send-email.utils');
const authorization = require("../core/auth.middleware");

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/password-forgot', forgotPassword);


module.exports = router;