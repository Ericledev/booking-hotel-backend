const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/:userId/get-trans", userController.handleUserGetTrans);

router.post("/login", userController.handleUserLogin);

router.post("/create-trans", userController.handleUserCreateTrans);

router.post("/signup", userController.handleUserSignUp);

module.exports = router;
