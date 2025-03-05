const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.getLoginPage = (req, res) => {
    res.render("login", {
        title: "Task Manager",
    });
};

exports.getRegisterPage = (req, res) => {
    res.render("register", {
        title: "Task Manager",
        error: req.flash("error"),
        message: req.flash("success"),
    });
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        res.redirect("/list");
    } catch (error) {
        res.render("login", { error: error.message });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.tokens = user.tokens.filter((token) => token.token !== req.token);
        await user.save();
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.verifyUser = async (req, res) => {
    try {
        const decoded = jwt.verify(
            req.params.token,
            process.env.JWT_SECRET || "thisismycourse"
        );
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(400).send({ error: "Invalid verification link." });
        }
        user.isVerified = true;
        await user.save();
        const token = await user.generateAuthToken();
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        res.redirect("/list");
    } catch (error) {
        res.status(400).send({ error: "Invalid or expired token." });
    }
};

exports.notFoundPage = (req, res) => {
    res.status(404).render("404");
};
