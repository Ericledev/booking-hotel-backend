const express = require("express");
const router = express.Router();
const typeController = require("../controllers/type");

router.get("/type", typeController.getTypeCountHotel);

module.exports = router;
