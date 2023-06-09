const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.route("/").post(userController.signup);
router.route("/login").post(userController.login);
router.route("/list").get(userController.list);
router.route("/auth").post(userController.protect);

module.exports = router;
