const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

// router.get("/:userId/get-trans", adminController.handleUserGetTrans);

router.post("/login", adminController.handleAdminLogin);

router.post("/signup", adminController.handleAdminSignUp);

module.exports = router;
