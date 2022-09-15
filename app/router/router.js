const router = require('express').Router();

const { HomeRoutes } = require('./api');
const { UserAuthRoutes } = require('./user/auth');

router.use("/user", UserAuthRoutes);
router.use("/", HomeRoutes);

module.exports = {
    AllRoutes : router
}