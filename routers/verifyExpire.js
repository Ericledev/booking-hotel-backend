const express = require("express");
const router = express.Router();
const verifyExpireController = require("../controllers/verifyExpire");
const auth = require("../middleware/auth");

router.get("/", auth, verifyExpireController.verifyExpire);

module.exports = router;
