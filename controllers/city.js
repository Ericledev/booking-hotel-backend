const City = require("../models/city");

const getCity = (req, res) => {
  // console.log("CHECK AUTH USER LOGIN: ", req.user);
  City.find()
    //.populate("hotels.hotelId")
    .then((cities) => {
      res.status(200).json({
        message: "ok",
        cities: cities,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = { getCity };
