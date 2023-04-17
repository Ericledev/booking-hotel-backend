const express = require("express");
const router = express.Router();
const transController = require("../controllers/transaction");
const auth = require("../middleware/auth");

router.get("/latest-trans", auth, transController.getLatestTran);

router.get("/all-trans", auth, transController.getAllTran);
// router.post("/signup", adminController.handleAdminSignUp);

module.exports = router;
