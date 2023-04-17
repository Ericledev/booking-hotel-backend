const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const typeSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Type", typeSchema);
