const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  rate: {
    type: Number,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  distance: {
    type: Number,
    require: true,
  },
  photos: [],
  desc: {
    type: String,
    require: true,
  },
  rating: {
    type: Number,
  },
  cheapestPrice: {
    type: Number,
  },
  featured: {
    type: Boolean,
  },
  free_cancel: {
    type: Boolean,
  },
  tag: {
    type: String,
    require: true,
  },
  rooms: [
    {
      roomId: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Room",
      },
    },
  ],
  title: {
    type: String,
    require: true,
  },
  cityId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "City",
  },
  typeId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "Type",
  },
});
module.exports = mongoose.model("Hotel", hotelSchema);
