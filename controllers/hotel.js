const Hotel = require("../models/hotel");
const City = require("../models/city");
const Transaction = require("../models/transaction");
const Room = require("../models/room");
const Type = require("../models/type");
const hotel = require("../models/hotel");

const getCityCountHotel = async (req, res) => {
  try {
    // group & count hotels in per city
    const citiesCountHotel = await Hotel.aggregate([
      {
        $group: {
          _id: "$cityId",
          count: { $count: {} },
        },
      },
    ]);
    // get city model
    const cities = await City.find();
    // update the number of hotel in cities
    const updateCities = cities.map((city) => {
      // find index of city in order to update number of hotel
      const index = citiesCountHotel.findIndex((element) => {
        return element._id.toString() === city._id.toString();
      });
      return {
        ...city._doc,
        subText:
          index !== -1
            ? citiesCountHotel[index].count.toString().concat(" properties")
            : "0 properties",
      };
    });
    // respone to cities that is updated the number of hotel under "subText" field
    res.status(200).json({
      message: "ok",
      cities: updateCities,
    });
  } catch (error) {
    res.status(403).json({
      message: "Fetch fail",
    });
  }
};

const get3HotelsMaxRate = async (req, res) => {
  try {
    const listHotel = await Hotel.find()
      .sort({ rate: "desc" })
      .limit(3)
      .select("name photos rate cheapestPrice")
      .populate("cityId", "name");

    res.status(200).json(listHotel);
  } catch (error) {
    console.log(error);
  }
};
const getSearchEmptyRooms = async (req, res) => {
  try {
    const { fromDate, toDate, hotelId } = req.body;

    // filter the rooms that is not available in fromDate - toDate
    let roomsUnavailable = [];
    const trans = await Transaction.find({
      hotel: { $eq: hotelId },
      status: { $ne: "Checkout" },
      $and: [
        { dateStart: { $lt: new Date(toDate) } },
        { dateEnd: { $gt: new Date(fromDate) } },
      ],
    });
    if (trans) {
      for (let i = 0; i < trans.length; i++) {
        for (let k = 0; k < trans[i].room.length; k++) {
          if (!roomsUnavailable.includes(trans[i].room[k])) {
            roomsUnavailable.push(trans[i].room[k]);
          }
        }
      }
    }

    // list out the hotels & typeOfRooms list
    const hotels = await Hotel.findById(hotelId).populate({
      path: "rooms.roomId",
    });
    hotels.rooms.map((typeOfRoom) => {
      const roomAvailable = typeOfRoom.roomId.roomNumbers.filter((roomNo) => {
        return !roomsUnavailable.includes(roomNo);
      });
      typeOfRoom.roomId.roomNumbers = [...roomAvailable];
    });

    res.status(200).json({
      hotels: hotels,
    });
  } catch (error) {
    res.status(403).json({
      message: "Fetch fail",
    });
  }
};

const getSearchHotel = async (req, res) => {
  try {
    const { des, fromDate, toDate, numberOfRoom, numberOfPeople } = req.body;

    // list out transaction is availabel
    const trans = await Transaction.find({ status: { $ne: "Checkout" } });

    // list out the hotels
    const hotels = await Hotel.find({ cityId: des })
      // .populate({
      //   path: "cityId",
      //   match: { name: { $eq: des } },
      // })
      .populate({
        path: "rooms.roomId",
      })
      .populate({
        path: "typeId",
      });
 
    // list out hotel by destination
    const filterHotel = hotels.filter((item) => {
      return item.cityId !== null;
    });
    // console.log("Check hotels: ", filterHotel);
    let dashboardRoom = [];
    // Push information of trans to dasboardRoom
    filterHotel.map((hotel) => {
      hotel.rooms.map((typeOfRoom) => {
        typeOfRoom.roomId.roomNumbers.map((roomNumber) => {
          let dateStart = null;
          let dateEnd = null;
          trans.map((tran) => {
            tran.room.map((r) => {
              if (
                tran.hotel.toString() === hotel._id.toString() &&
                r === roomNumber
              ) {
                dateStart = tran.dateStart;
                dateEnd = tran.dateEnd;
              }
            });
          });
          dashboardRoom.push({
            hotelId: hotel._id,
            name: hotel.name,
            distance: hotel.distance,
            rate: hotel.rate,
            description: hotel.typeId.name,
            tag: hotel.tag,
            free_cancel: hotel.free_cancel,
            price: hotel.cheapestPrice,
            image_url: hotel.photos[0],
            dateStart: dateStart,
            dateEnd: dateEnd,
          });
        });
      });
    });
    // filter dashboardRoom by date
    const dashboardRoomEmpty = dashboardRoom.filter((row) => {
      return (
        new Date(row.dateStart) >= new Date(toDate) ||
        new Date(row.dateEnd) <= new Date(fromDate)
      );
    });

    // group by hotel & count number of available rooms
    let groupAvailabelHotel = [];
    for (let i = 0; i < dashboardRoomEmpty.length; i++) {
      let count = 1;
      const isExist = groupAvailabelHotel.findIndex(
        (item) =>
          item.hotel.hotelId.toString() ===
          dashboardRoomEmpty[i].hotelId.toString()
      );
      if (isExist === -1) {
        for (let j = i + 1; j < dashboardRoomEmpty.length; j++) {
          if (
            dashboardRoomEmpty[i].hotelId.toString() ===
            dashboardRoomEmpty[j].hotelId.toString()
          ) {
            ++count;
          }
        }
        groupAvailabelHotel.push({
          hotel: dashboardRoomEmpty[i],
          numberOfAvailableRoom: count,
        });
      }
    }

    //filter hotel which is enough  the rooms
    const availabelHotel = groupAvailabelHotel.filter(
      (hotel) => hotel.numberOfAvailableRoom >= +numberOfRoom
    );

    res.status(200).json(availabelHotel);
  } catch (error) {
    console.log("CHECK ERROR: ", error);
    res.status(403).json({
      message: "Fetch fail",
    });
  }
};
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Hotel not found" });
  }
};

const getAllHotel = async (req, res) => {
  try {
    // const hotel = await Hotel.find({}, [
    //   "_id",
    //   "name",
    //   "typeId",
    //   "title",
    //   "cityId",
    // ])
    const hotel = await Hotel.find()
      .populate("cityId", "name")
      .populate("typeId", "name");
    res.status(200).json({ message: "ok", hotels: hotel });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Hotel not found" });
  }
};

const getTypeCityRoom = async (req, res) => {
  try {
    const city = await City.find({}, ["_id", "name"]);
    const type = await Type.find({}, ["_id", "name"]);
    let room = {};
    if (req.query.hotelId !== "add new") {
      room = await Room.find({ hotelId: req.query.hotelId }, ["_id", "title"]);
    }
    res.status(200).json({ message: "ok", city, type, room });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Fetch to fail" });
  }
};
const postAddNewHotel = async (req, res) => {
  const hotelInput = req.body;
  try {
    const hotel = new Hotel({
      name: hotelInput.name,
      typeId: hotelInput.typeId,
      cityId: hotelInput.cityId,
      address: hotelInput.address,
      distance: hotelInput.distance,
      title: hotelInput.title,
      desc: hotelInput.description,
      cheapestPrice: hotelInput.price,
      photos: hotelInput.photos,
      featured: hotelInput.feature,
      rooms: [], // selected,
      rate: "",
      tag: "",
      free_cancel: true,
    });
    await hotel.save();
    res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(403).json({ message: "fail" });
  }
};
const postUpdateHotel = async (req, res) => {
  const hotelInput = req.body;
  try {
    const hotel = await Hotel.findOne({ _id: hotelInput.hotelId });
    hotel.name = hotelInput.name;
    hotel.typeId = hotelInput.typeId;
    hotel.cityId = hotelInput.cityId;
    hotel.address = hotelInput.address;
    hotel.distance = hotelInput.distance;
    hotel.title = hotelInput.title;
    hotel.desc = hotelInput.description;
    hotel.cheapestPrice = hotelInput.price;
    hotel.photos = hotelInput.photos;
    hotel.featured = hotelInput.feature;
    // hotel.rooms= []
    hotel.rate = "";
    hotel.tag = "";
    hotel.free_cancel = true;

    await hotel.save();
    res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(403).json({ message: "fail" });
  }
};
const postUpdateRoomHotel = async (req, res) => {
  const hotelInput = req.body;
  try {
    const hotel = await Hotel.findById(hotelInput.hotelId);
    hotel.rooms = hotelInput.rooms;
    await hotel.save();
    res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(403).json({ message: "fail" });
  }
};
const postDeleteHotel = async (req, res) => {
  const hotelId = req.body.hotelId;
  try {
    const findHotel = await Transaction.findOne({ hotel: hotelId });
    if (findHotel) {
      res.status(200).json({ message: "delete fail" });
      return;
    }
    await Hotel.deleteOne({ _id: hotelId });
    res.status(200).json({ message: "ok" });
  } catch (error) {
    res.status(403).json({ message: "fail" });
  }
};

module.exports = {
  getCityCountHotel,
  get3HotelsMaxRate,
  getSearchHotel,
  getHotelById,
  getSearchEmptyRooms,
  getAllHotel,
  getTypeCityRoom,
  postAddNewHotel,
  postDeleteHotel,
  postUpdateHotel,
  postUpdateRoomHotel,
};
