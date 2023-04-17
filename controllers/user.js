const User = require("../models/user");
const Transaction = require("../models/transaction");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");

const handleUserLogin = (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    User.findOne({ email: email })
      .then(async (user) => {
        if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = jwt.sign(
            {
              userId: user._id,
              email: user.email,
            },
            process.env.TOKEN_KEY, // mysecret, it should be make by romdom function
            { expiresIn: process.env.EXPIRES_IN }
          );
          user.token = token;
          user.save();
          res.status(200).json({
            message: "ok",
            user: {
              userId: user._id,
              fullName: user.fullName,
              phoneNumber: user.phoneNumber,
              idCard: user.idCard,
              email: user.email,
              token: user.token,
            },
          });
        } else {
          res.status(200).json({
            message: "fail",
            user: { ok: false },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log("CHECK Error: ", error);
  }
};
// const handleUserLogout = (req, res, next) => {
//   console.log("CHECK SESSION: ", req.session);
//   req.session.destroy((err) => {
//     console.log("Check error", err);
//     res.status(200).json({
//       message: "user is loggedout",
//     });
//   });
// };

const handleUserSignUp = (req, res, next) => {
  const { email, password } = req.body;
  // Validate user input
  if (!(email && password)) {
    res.status(400).send("All input is required");
  }
  User.findOne({ email: email })
    .then(async (user) => {
      if (user) {
        res.status(200).json({
          message: "ok",
          exist: true,
        });
      } else {
        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);
        const user = new User({
          email: email,
          password: encryptedPassword,
          fullName: null,
          phoneNumber: null,
          idCard: null,
          isAdmin: false,
          token: null,
        });
        // Create token
        const token = jwt.sign(
          {
            userId: user._id,
            email: user.email,
            password: encryptedPassword,
          },
          process.env.TOKEN_KEY, // mysecret, it should be make by romdom function
          { expiresIn: process.env.EXPIRES_IN }
        );
        user.token = token;
        user.save();
        res.status(200).json({
          message: "ok",
          exist: false,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleUserCreateTrans = async (req, res, next) => {
  // console.log("CHECK BODY: ", req.body);
  // res.status(200).json({ message: "ok" });
  try {
    const {
      user: userId,
      hotel: hotelId,
      userInfo,
      room,
      price,
      payment,
      dateStart,
      dateEnd,
    } = req.body;
    // update user's info
    const user = await User.findById(userId);
    user.fullName = userInfo.fullName;
    user.phoneNumber = userInfo.phoneNumber;
    user.idCard = userInfo.idCard;
    await user.save();
    // create transaction
    const trans = new Transaction({
      user: userId,
      hotel: hotelId,
      room: room,
      dateStart: new Date(dateStart),
      dateEnd: new Date(dateEnd),
      price: price,
      payment: payment,
    });
    await trans.save();
    res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(403).json({ message: "fail" });
  }
};

const handleUserGetTrans = async (req, res, next) => {
  try {
    const trans = await Transaction.find({
      user: req.params.userId,
    }).populate("hotel", "name");
    res.status(200).json({ message: "ok", trans });
  } catch (error) {
    res.status(403).json({ message: "fail" });
  }
};
module.exports = {
  handleUserLogin,
  handleUserSignUp,
  handleUserCreateTrans,
  handleUserGetTrans,
}; //handleUserLogout
