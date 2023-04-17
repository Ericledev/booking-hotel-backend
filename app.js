require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const session = require("express-session");
//const MongoDBStore = require("connect-mongodb-session")(session);
const User = require("./models/user");

// Declare routers
const userRouter = require("./routers/user");
const adminRouter = require("./routers/admin");
const cityRouter = require("./routers/city");
const hotelRouter = require("./routers/hotel");
const typeRouter = require("./routers/type");
const verifyRouter = require("./routers/verifyExpire");
const transRouter = require("./routers/transaction");
const roomRouter = require("./routers/room");

const PORT = process.env.PORT;
const URL = process.env.MONGO_URI;

// create a storage at db to store session
// const store = new MongoDBStore({
//   uri: URL,
//   collection: "sessions",
// });

// create app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

// assign a session midleware
// app.use(
//   session({
//     secret: "asm2nodejs",
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//     cookie: {
//       maxAge: 1000 * 60 * 60,
//       sameSite: "none",
//       secure: false,
//     },
//   })
// );

// assign a midleware to check session from FrontEnd

// app.use((req, res, next) => {
//   if (!req.session.user) {
//     return next();
//   }
//   User.findById(req.session.user._id)
//     .then((user) => {
//       req.user = user;
//       next();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// Assign routers
app.use(verifyRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use(cityRouter);
app.use(hotelRouter);
app.use(typeRouter);
app.use(transRouter);
app.use(roomRouter);

mongoose.connect(URL).then(() => {
  app.listen(PORT, () => {
    console.log("Server runing at port: ", PORT);
  });
});
