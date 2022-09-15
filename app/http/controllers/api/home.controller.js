const Controller = require('../controller');
const createError = require('http-errors');
const { authSchema } = require('../../validators/user/auth.schema');

module.exports = new (class HomeController extends Controller {
    indexPage(req, res, next) {
        try {
            return res.status(200).json({
                statusCode: 200,
                message: "Index Page Store"
            })
        } catch (error) {
            next(error);
        }
    }
})();