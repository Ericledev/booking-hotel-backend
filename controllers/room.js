const Hotel = require("../models/hotel");
const City = require("../models/city");
const Transaction = require("../models/transaction");
const Room = require("../models/room");
const Type = require("../models/type");

// const getHotelById = async (req, res) => {
//   try {
//     const hotel = await Hotel.findById(req.params.id);
//     res.status(200).json(hotel);
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ message: "Hotel not found" });
//   }
// };

const getAllRoom = async (req, res) => {
  try {
    // const hotel = await Hotel.find({}, [
    //   "_id",
    //   "name",
    //   "typeId",
    //   "title",
    //   "cityId",
    // ])
    const room = await Room.find();
    res.status(200).json({ message: "ok", rooms: room });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Hotel not found" });
  }
};

// const getTypeCityRoom = async (req, res) => {
//   try {
//     const city = await City.find({}, ["_id", "name"]);
//     const type = await Type.find({}, ["_id", "name"]);
//     const room = await Room.find({}, ["_id", "title"]);

//     res.status(200).json({ message: "ok", city, type, room });
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ message: "Hotel not found" });
//   }
// };
const postAddNewRoom = async (req, res) => {
  const roomInput = req.body;
  //console.log("CHEck roomInput: ", roomInput);
  try {
    //Check room number is existed in the hotel
    const roomN = await Room.findOne({
      hotelId: roomInput.hotelId,
      roomNumbers: { $in: roomInput.roomNumbers },
    });

    // if is existed then res to client, create fail
    if (roomN) {
      res.status(200).json({ message: "create fail" });
      return;
    }
    const room = new Room({
      title: roomInput.title,
      desc: roomInput.desc,
      price: roomInput.price,
      maxPeople: roomInput.maxPeople,
      roomNumbers: roomInput.roomNumbers,
      hotelId: roomInput.hotelId,
    });
    await room.save();

    // insert roomId to hotel
    const roomIds = await Room.find({ hotelId: roomInput.hotelId }, "_id");
    const hotel = await Hotel.findById(roomInput.hotelId);
    const roomIdList = [];
    for (let i = 0; i < roomIds.length; i++) {
      roomIdList.push({ roomId: roomIds[i]._id.toString() });
    }

    hotel.rooms = roomIdList;
    await hotel.save();

    res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(403).json({ message: "fail" });
  }
};
const postUpdateRoom = async (req, res) => {
  const roomInput = req.body;
  try {
    //Check room number is existed in the hotel
    const roomN = await Room.findOne({
      _id: { $nin: roomInput.roomId },
      hotelId: roomInput.hotelId,
      roomNumbers: { $in: roomInput.roomNumbers },
    });
    // if is existed then res to client, create fail
    if (roomN) {
      res.status(200).json({ message: "create fail" });
      return;
    }
    // if room number is not existed then update
    const room = await Room.findById(roomInput.roomId);

    room.title = roomInput.title;
    room.desc = roomInput.desc;
    room.price = roomInput.price;
    room.maxPeople = roomInput.maxPeople;
    room.roomNumbers = roomInput.roomNumbers;
    room.hotelId = roomInput.hotelId;

    await room.save();
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log("CHECK error: ", error);
    res.status(403).json({ message: "fail" });
  }
};

const postDeleteRoom = async (req, res) => {
  const roomId = req.body.roomId;
  try {
    // get hotel have the type of room
    const hotel = await Room.findOne({ _id: roomId }).select(
      "hotelId roomNumbers"
    );
    // find out transaction have hotelId and room of number
    const tran = await Transaction.findOne({
      hotel: hotel.hotelId,
      room: { $in: hotel.roomNumbers },
    });
    // if find out tran
    if (tran) {
      res.status(200).json({ message: "delete fail" });
      return;
    }
    // if not find out tran (tran=null)
    await Room.deleteOne({ _id: roomId });

    // Update/remove roomId in the hotel
    const updatedHotel = await Hotel.findById(hotel.hotelId);
    const roomIdFilter = updatedHotel.rooms.filter((room) => {
      return room.roomId.toString() !== roomId;
    });
    updatedHotel.rooms = roomIdFilter;
    await updatedHotel.save();
    res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(403).json({ message: "fail" });
  }
};

module.exports = {
  getAllRoom,
  postAddNewRoom,
  postDeleteRoom,
  postUpdateRoom,
};
