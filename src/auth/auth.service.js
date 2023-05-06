const connectDB = require('../core/database.js');
const db = require('../models/index');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { BadRequest, NotFound } = require('http-errors');
const saltRounds = 10;
const dotenv = require('dotenv');
const { sendMail } = require('../core/utils/send-email.utils');
const otpGenerator = require('otp-generator');
const crypto = require('crypto')
const { TokenType } = require('../core/constant');
const { Op } = require('sequelize')
dotenv.config();

async function signup(body) {
    const checkExist = await db.User.findOne({
        where: { email: body.email }
    });
    if (checkExist) throw new BadRequest('Email already existed');

    const salt = await bcrypt.genSalt(saltRounds)
    const hashPwd = await bcrypt.hash(body.password, salt);

    const user = await db.User.create({
        ...body,
        hashedPassword: hashPwd,
        role: 'customer',
        verify: false
    })
    delete hashPwd;
    delete user.dataValues.hashedPassword;

    const newOtp = generateOTP();
    const otpLink = `${process.env.WEB_OTP_URL}/${user.email}`;

    const verifyToken = await db.token.create({
        userId: user.id,
        token: crypto.createHash('sha256').update(newOtp).digest('hex'),
        expiredAt: new Date(Date.now() + +process.env.EXPIRED_VERIFY_ACCOUNT_TOKEN),
        type: TokenType.SIGNUP
    })
    console.log(verifyToken)
    sendMail({
        email: user.email,
        subject: "Goldduck Camera - Confirm Account",
        template: 'send-otp',
        context: { newOtp, otpLink }
    }).catch(error => console.log(error));
    return user;
}

async function signin(body) {
    const checkExist = await db.User.findOne({
        where: { email: body.email }
    });

    if (!checkExist) throw new Unauthorized('Email or password is incorrect');

    const iPwd = bcrypt.compare(body.password, checkExist.hashedPassword);

    if (!iPwd) throw new Unauthorized('Email or password is incorrect');

    const accessToken = jwt.sign(
        { id: checkExist.id, email: checkExist.email, role: checkExist.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '2h' }
    )

    const { ...newUser } = checkExist;
    delete newUser.dataValues.hashedPassword
    return { information: newUser.dataValues, accessToken };
}

async function forgotPassword(body) {
    const user = await db.User.findOne({
        where: { email: body.email },
        attribute: ['id', 'email']
    })
    if (!user) throw new NotFound('User not found');

    let token = await db.token.findOne({
        where: {
            userId: user.id,
            expiredAt: { [Op.gte]: (new Date()) },
        }
    })
    if (!token) {
        token = await db.token.create({
            userId: user.id,
            token: randomBytes(32).toString("hex"),
            expiredAt: new Date(Date.now() + +process.env.EXPIRED_RESET_PASSWORD_TOKEN),
            type: TokenType.FORGOT_PASSWORD
        })
    }
    const resetPasswordLink = `${process.env.WEB_FORGOT_PASSWORD_URL}/${user.id}/${token.token}`;
    sendMail({
        email: user.email,
        subject: "Goldduck Camera - Password reset",
        template: 'reset-password',
        context: { resetPasswordLink }
    }).catch(error => console.log(error));
}
async function resetPassword(body) {
    const user = await db.User.findOne({
        where: {
            id: body.id
        },
        attribute: ['id', 'email', 'hashedPassword', 'role'],
    });

    if (!user) {
        throw new Unauthorized('Invalid link or expired');
    }

    let token = await db.token.findOne({
        where: {
            userId: user.id,
            token: body.token,
            expiredAt: { [Op.gte]: (new Date()) },
            type: TokenType.FORGOT_PASSWORD
        }
    })

    if (!token) {
        throw new Unauthorized('Invalid link or expired');
    }

    const salt = await bcrypt.genSalt(saltRounds)
    user.hashedPassword = await bcrypt.hash(body.password, salt);
    await db.User.bulkCreate(user, { updateOnDuplicate: ["hashedPassword"] });
    await db.token.destroy({ where: { id: token.id } })
}
async function getUserFromGG(body) {
    const user = body._json;
    let userExisted = await db.User.findOne({
        where: { email: user.email },
        attribute: ['address', 'birthday', 'createdAt', 'deletedAt', 'updatedAt', 'email', 'fullname', 'gender', 'hashedPassword', 'id', 'numberPhone', 'role']
    })
    if (userExisted) {
        await db.User.create({
            fullname: user.name,
            email: user.email,
            role: 'customer',
            verify: 1
        })
        userExisted = userExisted.dataValues;
    } else userExisted = userExisted.dataValues;

    const accessToken = jwt.sign(
        { id: userExisted.id, email: userExisted.email, role: userExisted.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '2h' }
    )

    const { hashedPassword, ...information } = userExisted;
    return { information, accessToken }
}
function generateOTP() {
    return otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
    });
}
async function confirmAccount(body) {
    const user = await db.User.findOne({
        where: {
            email: body.email
        }
    });

    if (!user) {
        throw new BadRequest('Invalid link or expired');
    }

    const otpHash = crypto.createHash('sha256').update(body.otp.toString()).digest('hex');

    const confirmToken = await db.token.findOne({
        where: {
            userId: user.id,
            token: otpHash,
            expiredAt: { [Op.gte]: (new Date()) },
            type: TokenType.SIGNUP
        }
    })

    if (!confirmToken) {
        throw new BadRequest('Invalid link or expired');
    }

    user.verify = 1;
    await user.save();
    await db.token.destroy({
        where: { id: confirmToken.id }
    });
}

async function resendOTP(body) {
    const user = await db.User.findOne({
        where: {
            email: body.email
        }
    });
    if (!user) {
        throw new BadRequest('User with given email does not exist');
    }

    const newOtp = generateOTP();

    let currentToken = await db.token.findOne({
        where: {
            userId: user.id,
            expiredAt: { [Op.gte]: (new Date()) },
            type: TokenType.SIGNUP
        }
    });

    if (!currentToken) {
        throw new BadRequest('Verified account');
    }

    await db.token.destroy({ where: { id: currentToken.id } });

    const verifyToken = await db.token.create({
        userId: user.id,
        token: crypto.createHash('sha256').update(newOtp).digest('hex'),
        expiredAt: new Date(Date.now() + +process.env.EXPIRED_VERIFY_ACCOUNT_TOKEN),
        type: TokenType.SIGNUP
    })

    sendMail({
        email: user.email,
        subject: "Goldduck Camera - Confirm Account",
        template: 'send-otp',
        context: { newOtp }
    }).catch(error => console.log(error));
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