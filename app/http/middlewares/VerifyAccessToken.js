const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const { ACCESS_TOKEN_SECRET_KEY } = require("../../utils/constants");
const { UserModel } = require('../../models/users');

function VerifyAccessToken(req, res, next) {
    const headers = req.headers;
    //console.table(headers); // in dastoor ra check konim dar terminal va inke dar swagger marboote nanevisim accessToken balke benevisim access-token
    const [bearer, token] = headers?.["access-token"]?.split(" ") || [];  // ba inkar destructure anjam dade iim va chon access-token havie dash mibashad bayad an ra be in shekl benevisim
    if (token && ["Bearer", "bearer"].includes(bearer)) {
        JWT.verify(token, ACCESS_TOKEN_SECRET_KEY, async (err, payload) => {
            if (err) return next(createError.Unauthorized("وارد حساب کاربری خود شوید"));
            const { mobile } = payload || {};  // payload ra dar function SignAccessToken file functions.js folder utils define karde iim
            const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 });
            if (!user) return next(createError.Unauthorized("حساب کاربری یافت نشد"));
            req.user = user;
            return next();
        })
    }
    else return next(createError.Unauthorized("مجددا وارد حساب کاربری خود شوید"));
};
module.exports = {
    VerifyAccessToken
}