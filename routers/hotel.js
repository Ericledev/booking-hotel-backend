const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotel");
const auth = require("../middleware/auth");

router.get("/hotel/all", auth, hotelController.getAllHotel);

router.get(
  "/hotel/get-info-hotel-input",
  auth,
  hotelController.getTypeCityRoom
);

router.get("/hotel", hotelController.getCityCountHotel);

router.get("/hotel/detail/:id", hotelController.getHotelById);

router.get("/hotel/top-rating", hotelController.get3HotelsMaxRate);

router.post("/hotel/room/search", auth, hotelController.getSearchEmptyRooms);

router.post("/hotel/search", hotelController.getSearchHotel);

router.post("/hotel/add-new", auth, hotelController.postAddNewHotel);

router.post("/hotel/delete", auth, hotelController.postDeleteHotel);

router.post("/hotel/update", auth, hotelController.postUpdateHotel);

module.exports = router;
