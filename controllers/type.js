const Hotel = require("../models/hotel");
const Type = require("../models/type");

const getTypeCountHotel = async (req, res) => {
  // group & count hotels in per city
  const typesCountHotel = await Hotel.aggregate([
    {
      $group: {
        _id: "$typeId",
        count: { $count: {} },
      },
    },
  ]);
  // get city model
  const types = await Type.find();
  // update the number of hotel in types
  const updateTypes = types.map((type) => {
    // find index of city in order to update number of hotel
    const index = typesCountHotel.findIndex((element) => {
      return element._id.toString() === type._id.toString();
    });
    return {
      ...type._doc,
      count:
        index !== -1
          ? typesCountHotel[index].count.toString().concat(" hotels")
          : "0 hotels",
    };
  });
  // respone to types that is updated the number of hotel under "count" field
  res.status(200).json({
    message: "ok",
    types: updateTypes,
  });
};

module.exports = { getTypeCountHotel };
