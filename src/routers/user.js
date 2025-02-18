const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const sendVerificationEmail = require("../emails/verification");

router.post("/user", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        await sendVerificationEmail(user);
        req.flash("success", "Registration successful. Check your email for verification.");
        res.redirect('/register');
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get("/profile", auth, async (req, res) => {
    try {
        const user = req.user;
        res.render("profile", {
            title: "Your Profile",
            username: user.name,
            email: user.email,
            age: user.age || "N/A",
            error: req.flash("error"),
            success: req.flash("success"),
        });
    } catch (error) {
        res.status(500).send("Server error");
    }
});

router.post("/update-profile", auth, async (req, res) => {
    try {
        const { currentPassword, newPassword, name, age } = req.body;

        const isMatch = await bcrypt.compare(currentPassword, req.user.password);
        if (!isMatch) {
            req.flash("error", "Incorrect current password");
            return res.redirect("/profile");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        req.user.password = hashedPassword;
        req.user.name = name;
        req.user.age = age;
        await req.user.save();
        req.flash("message", "Profile Updated Succesfully");
        res.redirect("/profile");
    } catch (error) {
        req.flash("error", "An error occurred while deleting the task.");
        res.redirect("/profile");
    }
});

router.post("/delete-account", auth, async (req, res) => {
    try {
        await req.user.deleteOne();
        res.clearCookie("token");
        res.redirect("/register");
    } catch (error) {
        res.status(500).send({ error: "Error deleting account", details: error.message });
    }
});

module.exports = router;