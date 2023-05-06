const express = require('express');
const {
    signup,
    signin,
    forgotPassword,
    resetPassword,
    getUserFromGG,
    confirmAccount,
    resendOTP
} = require('./auth.controller');
const { sendMail } = require('../core/utils/send-email.utils');
const authorization = require("../core/auth.middleware");
const passport = require('passport');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/password-forgot', forgotPassword);
router.post('/password-reset', resetPassword);
router.post('/signup/confirm', confirmAccount);
router.post('/signup/resent-otp', resendOTP);
router.get('/google/login', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google', passport.authenticate('google', { failureRedirect: '/error' }), getUserFromGG);


module.exports = router;