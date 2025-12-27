const User = require("../models/User");
const jwt = require("jsonwebtoken");



const generateAccessToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "15m" });

const generateRefreshToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "1d",
    });


exports.register = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.json({ accessToken, refreshToken });
    } catch (error) {
        if (error.code === 11000) {
            error.status = 400;
            error.message = "Email already exists";
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("Invalid Email");
            error.status = 401;
            throw error;
        }

        if (!(await user.comparePassword(password))) {
            const error = new Error("Invalid Password");
            error.status = 401;
            throw error;
        }
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.json({ accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
};

exports.refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ error: "Missing refresh token" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ error: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user._id);
    res.json({ accessToken });
};

exports.logout = async (req, res) => {
    req.user.refreshToken = null;
    await req.user.save();
    res.json({ message: "Logged out" });
};


