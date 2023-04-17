const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const citySchema = Schema({
  name: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("City", citySchema);
