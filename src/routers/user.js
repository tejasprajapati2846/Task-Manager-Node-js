const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

router.post("/user", userController.userRegister);

router.get("/profile", auth, userController.getProfilePage);

router.post("/update-profile", auth, userController.updateProfile);

router.post("/delete-account", auth, userController.deleteUser);

module.exports = router;