const connectDB = require('../core/database.js');
const db = require('../models/index');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { BadRequest } = require('http-errors');
const saltRounds = 10;
const dotenv = require('dotenv');
dotenv.config();

async function signup(body) {
    const checkExist = await db.User.findOne({
        where: { email: body.email }
    });
    if (checkExist) throw new BadRequest('Email already existed');

    const salt = await bcrypt.genSalt(saltRounds)
    const hashPwd = await bcrypt.hash(body.password, salt);

    const numberPhone = body.numberPhone;
    delete body.numberPhone;
    const user = await db.User.create({
        ...body,
        hashed_password: hashPwd,
        role: 'customer',
        number_phone: numberPhone,
        verify: '1'
    })
    delete hashPwd;
    delete user.dataValues.hashed_password;

    const token = jwt.sign(
        { user },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '2h' }
    )
    user.dataValues.token = token;

    return user;
}

module.exports = {
    signup
}