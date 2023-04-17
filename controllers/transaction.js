const { Decimal128 } = require("mongodb");
const Transaction = require("../models/transaction");
const User = require("../models/user");

const getLatestTran = async (req, res) => {
  try {
    const trans = await Transaction.find()
      .populate([
        { path: "user", select: "fullName" },
        { path: "hotel", select: "name" },
      ])
      .sort({ updatedAt: "desc" })
      .limit(8);
    const numOfUsers = (await User.find({ isAdmin: false })).length;
    const transaction = await Transaction.find();
    const numOfTrans = transaction.length;
    const earning = transaction.reduce((total, item) => total + item.price, 0);
    const balance = (earning / 12).toFixed(2);
    //console.log("CHECK COUNT USER: ", balance.toFixed(2));

    res.status(200).json({
      message: "ok",
      trans: trans,
      numOfUsers,
      numOfTrans,
      earning,
      balance,
    });
  } catch (error) {
    console.log(error);
  }
};
const getAllTran = async (req, res) => {
  try {
    const trans = await Transaction.find().populate([
      { path: "user", select: "fullName" },
      { path: "hotel", select: "name" },
    ]);

    res.status(200).json({
      message: "ok",
      trans: trans,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { getLatestTran, getAllTran };
