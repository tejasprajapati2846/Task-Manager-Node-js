const User = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            if (req.path === "/login") return next();
            return res.redirect("/login");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
        if (!user) {
            if (req.path === "/login") return next();
            return res.redirect("/login");
        }
        if (req.path === "/login") return res.redirect('/list');
            
        req.user = user;
        next();
    } catch (e) {
        res.clearCookie("auth_token");
        return res.render("login", { error: "Please authenticate" });
    }
};

module.exports = auth;
