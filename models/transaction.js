const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = Schema({
  user: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "User",
  },
  hotel: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "Hotel",
  },
  room: [],
  dateStart: {
    type: Date,
    require: true,
  },
  dateEnd: {
    type: Date,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  payment: {
    //Credit Card, Cash
    type: String,
    require: true,
  },
  status: {
    //Booked, Checkin, Checkout
    type: String,
    require: true,
    default: "Booked",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    require: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
    require: true,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);

// transactionSchema.methods.createTrans = function () {
//   console.log(
//     "CHECK COVERT TO DATE: ",
//     new Date("2023-10-25"),
//     "=",
//     new Date("2023-10-27")
//   );
//   this.user = "6411d789942c9265825fe42a";
//   this.hotel = "6311a54a4a642f0142349086";
//   this.room = ["101"];
//   this.dateStart = new Date("2023-10-25");
//   this.dateEnd = new Date("2023-10-27");
//   this.price = 200;
//   this.payment = "Cash";
//   this.status = "Booked";
//   return this.save();
// };
