const User = require("../models/user");
//const Transaction = require("../models/transaction");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");

const handleAdminLogin = (req, res, next) => {
  const { email, password } = req.body;
  // Validate user input
  if (!(email && password)) {
    res.status(400).send("All input is required");
  }
  User.findOne({ email: email, isAdmin: true })
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
};

const handleAdminSignUp = (req, res, next) => {
  const { email, password } = req.body;
  // Validate user input
  if (!(email && password)) {
    res.status(400).send("All input is required");
  }
  User.findOne({ email: email })
    .then(async (user) => {
      // check user existed
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
          isAdmin: true,
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

// const handleUserGetTrans = async (req, res, next) => {
//   try {
//     const trans = await Transaction.find({
//       user: req.params.userId,
//     }).populate("hotel", "name");
//     res.status(200).json({ message: "ok", trans });
//   } catch (error) {
//     res.status(403).json({ message: "fail" });
//   }
// };
module.exports = {
  handleAdminLogin,
  handleAdminSignUp,
  //handleUserGetTrans,
};
