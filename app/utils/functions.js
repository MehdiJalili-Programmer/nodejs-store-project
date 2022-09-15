const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const { UserModel } = require('../models/users');
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require('./constants');

function RandomNumberGenerator() {
    return Math.floor((Math.random() * 90000) + 10000)
};
function SignAccessToken(userID) {
    return new Promise(async (resolve, reject) => {
        const user = await UserModel.findById(userID);
        const payload = {
            mobile: user.mobile
        };
        const secret = ACCESS_TOKEN_SECRET_KEY;
        const options = {
            expiresIn: "1h"
        };
        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(createError.InternalServerError("خطای سرور"));
            resolve(token);
        })
    })
};
function SignRefreshToken(userID) {
    return new Promise(async (resolve, reject) => {
        const user = await UserModel.findById(userID);
        const payload = {
            mobile: user.mobile
        };
        const secret = REFRESH_TOKEN_SECRET_KEY;
        const options = {
            expiresIn: "1y"
        };
        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(createError.InternalServerError("خطای سرور"));
            resolve(token);
        })
    })
};
function VerifyRefreshToken(token) {
    return new Promise((resolve, reject) => {
        JWT.verify(token, REFRESH_TOKEN_SECRET_KEY, async (err, payload) => {
            if (err) reject(createError.Unauthorized("وارد حساب کاربری خود شوید"));
            const { mobile } = payload || {};  // payload ra dar function SignAccessToken file functions.js folder utils define karde iim
            const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 });
            if (!user) reject(createError.Unauthorized("حساب کاربری یافت نشد"));
            resolve(mobile);
        })
    })
};

module.exports = {
    RandomNumberGenerator,
    SignAccessToken,
    SignRefreshToken,
    VerifyRefreshToken
}