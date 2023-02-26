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

    const user = await db.User.create({
        ...body,
        hashedPassword: hashPwd,
        role: 'customer',
        verify: '1'
    })
    delete hashPwd;
    delete user.dataValues.hashedPassword;

    // const token = jwt.sign(
    //     { user },
    //     process.env.JWT_SECRET_KEY,
    //     { expiresIn: '2h' }
    // )
    // user.dataValues.token = token;

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
module.exports = {
    signup,
    signin
}