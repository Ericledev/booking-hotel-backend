const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roomController = require("../controllers/room");

router.get("/room/all", auth, roomController.getAllRoom);

router.post("/room/add-new", auth, roomController.postAddNewRoom);

router.post("/room/delete", auth, roomController.postDeleteRoom);

router.post("/room/update", auth, roomController.postUpdateRoom);

module.exports = router;
