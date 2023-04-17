const express = require("express");
const router = express.Router();
const cityController = require("../controllers/city");
const auth = require("../middleware/auth");

router.get("/city", cityController.getCity);

module.exports = router;
