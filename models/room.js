const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = Schema({
  title: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  maxPeople: {
    type: Number,
    require: true,
  },
  desc: {
    type: String,
    require: true,
  },
  roomNumbers: [],
  hotelId: {
    type: ObjectId,
    require: true,
  },
});

module.exports = mongoose.model("Room", roomSchema);
