const asyncHandler = require("express-async-handler");
const Boat = require("../models/Boat");
const Reservation = require("../models/Reservation");

// PUBLIC
const getBoats = asyncHandler(async (req, res) => {
  const boats = await Boat.find({ status: "published" });
  res.json(boats);
});

const getBoatById = asyncHandler(async (req, res) => {
  const boat = await Boat.findById(req.params.id);
  if (!boat) {
    res.status(404);
    throw new Error("Boat not found");
  }
  res.json(boat);
});

const searchBoats = asyncHandler(async (req, res) => {
  const {
    type,
    startDate,
    endDate,
    priceMin,
    priceMax,
    capacityMin,
    capacityMax,
    withCaptain,
    ratingMin,
  } = req.query;

  let filter = {};

  if (type) filter.type = type;
  if (priceMin || priceMax) filter.pricePerDay = {};
  if (priceMin) filter.pricePerDay.$gte = Number(priceMin);
  if (priceMax) filter.pricePerDay.$lte = Number(priceMax);
  if (capacityMin || capacityMax) filter.capacity = {};
  if (capacityMin) filter.capacity.$gte = Number(capacityMin);
  if (capacityMax) filter.capacity.$lte = Number(capacityMax);
  if (withCaptain !== undefined) filter.withCaptain = withCaptain === "true";
  if (ratingMin) filter.rating = { $gte: Number(ratingMin) };

  let boats = await Boat.find(filter);

  // Tikriname laisvumas pagal startDate / endDate
  if (startDate && endDate) {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    boats = await Promise.all(
      boats.map(async (boat) => {
        const conflict = await Reservation.findOne({
          boat: boat._id,
          $or: [{ startDate: { $lte: eDate }, endDate: { $gte: sDate } }],
        });
        return conflict ? null : boat;
      })
    );

    boats = boats.filter((b) => b !== null);
  }

  res.json(boats);
});

module.exports = {
  getBoats,
  getBoatById,
  searchBoats,
};
