const userModel = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenblacklistModel = require("../models/blacklistmodel.js");
const { OAuth2Client } = require("google-auth-library");

const googleOAuth = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
}

async function registerUser(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const userAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    });
    if (userAlreadyExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = new userModel({
        username,
        email,
        password: hash,
        provider: "local",
    })
    await newUser.save();

    const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
    )
    res.cookie("token", token, COOKIE_OPTIONS)
    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        }
    });
}

async function loginUserController(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
    )
    res.cookie("token", token, COOKIE_OPTIONS)
    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
}

async function logoutUserController(req, res) {
    const token = req.cookies.token;
    if (token) {
        await tokenblacklistModel.create({ token });
    }
    res.clearCookie("token", COOKIE_OPTIONS)
    res.status(200).json({
        message: "user logged out successfully"
    })
}

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);
    res.status(200).json({
        message: "user details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function googleLoginController(req, res) {
    const { token } = req.body;
    let payload;
    try {
        const ticket = await googleOAuth.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
    } catch (error) {
        console.error("Error verifying Google token:", error);
        return res.status(401).json({ message: "Invalid Google token" });
    }

    const { email, name, picture, sub, email_verified } = payload;

    if (!email_verified) {
        return res.status(401).json({ message: "Google email is not verified" });
    }

    let user = await userModel.findOne({ email });
    if (!user) {
        user = new userModel({
            username: name,
            email: email,
            provider: "google",
            googleId: sub,
            avatar: picture,
        });
        await user.save();
    }

    const JWTtoken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
    );
    res.cookie("token", JWTtoken, COOKIE_OPTIONS)  // ✅ fixed
    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
}

module.exports = { registerUser, loginUserController, logoutUserController, getMeController, googleLoginController };