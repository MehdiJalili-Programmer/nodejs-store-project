const createError = require('http-errors');
const Controller = require('../../controller');
const { RandomNumberGenerator, SignAccessToken, VerifyRefreshToken, SignRefreshToken } = require('../../../../utils/functions');
const { getOtpSchema, checkOtpSchema } = require('../../../validators/user/auth.schema');
const { UserModel } = require('../../../../models/users');
const { EXPIRES_IN, USER_ROLE } = require('../../../../utils/constants');

class UserAuthController extends Controller {
    async getOtp(req, res, next) {
        try {
            await getOtpSchema.validateAsync(req.body);
            const { mobile } = req.body;
            const code = RandomNumberGenerator();
            const result = await this.saveUser(mobile, code);
            if (!result) throw createError.Unauthorized("ورود شما انجام نشد");
            return res.status(200).json({
                data: {
                    statusCode: 200, 
                    message: "کد اعتبارسنجی باموفقیت برای شما ارسال شد",
                    code,
                    mobile
                }
            });
        } catch (error) {
            next(error);
        }
    };
    async checkOtp(req, res, next) {
        try {
            await checkOtpSchema.validateAsync(req.body);
            const { mobile, code } = req.body;
            const user = await UserModel.findOne({ mobile });
            if (!user) throw createError.NotFound("کاربر یافت نشد");
            if (user.otp.code != code) throw createError.Unauthorized("کد ارسال شده  صحیح نمیباشد");
            const now = Date.now();
            if (Number(user.otp.expiresIn) < now) throw createError.Unauthorized("کد شما منقصی شده است");
            const accessToken = await SignAccessToken(user._id);
            const refreshToken = await SignRefreshToken(user._id);
            return res.json({
                data: {
                    accessToken,
                    refreshToken
                }
            })
        } catch (error) {
            next(error)
        }
    };
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const mobile = await VerifyRefreshToken(refreshToken);
            const user = await UserModel.findOne({ mobile });
            const accessToken = await SignAccessToken(user._id);
            const newRefreshToken = await SignRefreshToken(user._id);
            return res.json({
                data: {
                    accessToken,
                    refreshToken : newRefreshToken
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async saveUser(mobile, code) {
        let otp = {
            code,
            expiresIn: EXPIRES_IN
        }
        const result = await this.checkExistUser(mobile);
        if (result) {
            return (await this.updateUser(mobile, {otp}))
        };
        return !!(await UserModel.create({
            mobile,
            otp,
            Roles: [USER_ROLE]
        }))
    };
    async checkExistUser(mobile) {
        const user = await UserModel.findOne({ mobile });
        return !!user
    };
    async updateUser(mobile, objectData = {}) {
        Object.keys(objectData).forEach(key => {
            if (["", " ", null, undefined, 0, NaN].includes(objectData[key])) delete objectData[key];
        })
        const updateResult = await UserModel.updateOne({ mobile }, { $set: objectData });
        return !!updateResult.modifiedCount
    }; 
};

module.exports = {
    UserAuthController : new UserAuthController(),
}