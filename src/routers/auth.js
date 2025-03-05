const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const authController = require('../controllers/authController');

router.get("/login", auth, authController.getLoginPage);

router.get("/register", authController.getRegisterPage);

router.post("/login", authController.loginUser);

router.post("/logout", auth, authController.logoutUser);

router.get("/verify/:token", authController.verifyUser);

router.all("*", authController.notFoundPage);

module.exports = router;