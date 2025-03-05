const User = require("../models/user");
const bcrypt = require("bcrypt");
const agenda = require("../agenda");

exports.userRegister = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        await agenda.now("send verification email", { user });
        req.flash(
            "success",
            "Registration successful. Check your email for verification."
        );
        res.redirect("/register");
    } catch (e) {
        res.status(500).send(e);
    }
};

exports.getProfilePage = async (req, res) => {
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
};

exports.updateProfile = async (req, res) => {
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
};

exports.deleteUser = async (req, res) => {
    try {
        await req.user.deleteOne();
        res.clearCookie("token");
        res.redirect("/register");
    } catch (error) {
        res
            .status(500)
            .send({ error: "Error deleting account", details: error.message });
    }
};
