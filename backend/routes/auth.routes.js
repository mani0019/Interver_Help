const express = require("express");
const { Router } = express;
const authRoute = Router();
const authController = require("../controllers/auth.controllers.js");
const authmiddleware = require("../middleware/auth.middleware.js");
const { authLimiter } = require("../config/rateLimit.config");
/**
 * @route POST /api/auth/register
 * @discription Register a new user
 * @access public
 */
authRoute.post("/test", (req, res) => {
    res.send("Test route working");
});
authRoute.post("/register",authLimiter,authController.registerUser);

/**
 * @route POST /api/auth/login
 * @discription Login a user
 * @access public
 */

authRoute.post("/login",authLimiter,authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @discription clear the token cookie and blacklist the token
 * @access public
 */
authRoute.get("/logout",authController.logoutUserController);

/**
 * @route GET/api/auth/get-me
 * @discription Get the details of the logged in user
 * @access private
 */
authRoute.get('/get-me',authmiddleware.authUser,authController.getMeController);

/**
 * @route POST /api/auth/google-login
 * @discription Login a user using Google OAuth
 * @access public
 */
console.log("google controller =", authController.googleLoginController);

authRoute.post("/google-login",authController.googleLoginController);



module.exports = authRoute

