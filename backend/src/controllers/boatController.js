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
    sort,
    yearMin,
    yearMax,
    lengthMin,
    lengthMax,
    cabinsMin,
    location,
    page = 1,
    limit = 9, // default 9 per page
  } = req.query;

  const filter = { status: "published" };

  if (type) filter.type = type;
  if (priceMin || priceMax) filter.pricePerDay = {};
  if (priceMin) filter.pricePerDay.$gte = Number(priceMin);
  if (priceMax) filter.pricePerDay.$lte = Number(priceMax);
  if (capacityMin || capacityMax) filter.capacity = {};
  if (capacityMin) filter.capacity.$gte = Number(capacityMin);
  if (capacityMax) filter.capacity.$lte = Number(capacityMax);
  if (withCaptain !== undefined) filter.withCaptain = withCaptain === "true";
  if (ratingMin) filter.rating = { $gte: Number(ratingMin) };
  if (yearMin || yearMax) filter.year = {};
  if (yearMin) filter.year.$gte = Number(yearMin);
  if (yearMax) filter.year.$lte = Number(yearMax);
  if (lengthMin || lengthMax) filter.length = {};
  if (lengthMin) filter.length.$gte = Number(lengthMin);
  if (lengthMax) filter.length.$lte = Number(lengthMax);
  if (cabinsMin) filter.cabins = { $gte: Number(cabinsMin) };
  if (location) filter.location = { $regex: location, $options: "i" };

  let sortOption = {};
  if (sort === "price-asc") sortOption = { pricePerDay: 1 };
  if (sort === "price-desc") sortOption = { pricePerDay: -1 };
  if (sort === "capacity") sortOption = { capacity: -1 };
  if (!sort) sortOption = { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  // Pirma pasiimam laivus, kurie atitinka filtrus
  const total = await Boat.countDocuments(filter);

  let boats = await Boat.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  // Filtruojam pagal datas (jeigu nurodytos)
  if (startDate && endDate) {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    boats = await Promise.all(
      boats.map(async (boat) => {
        const conflict = await Reservation.findOne({
          boat: boat._id,
          status: { $in: ["pending", "approved", "active"] },
          startDate: { $lte: eDate },
          endDate: { $gte: sDate },
        });
        return conflict ? null : boat;
      })
    );

    boats = boats.filter(Boolean);
  }

  res.json({
    boats,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

const getBookedDates = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Patikrinam ar laivas egzistuoja
  const boat = await Boat.findById(id);
  if (!boat) {
    return res.status(404).json({ message: "Boat not found" });
  }

  // Filtruojam rezervacijas tik su aktyviais statusais
  const reservations = await Reservation.find({
    boat: id,
    status: { $in: ["pending", "approved", "active"] }, // ✅ rodom tik aktyvias/patvirtintas
  });

  // Grąžinam tik datas (start + end)
  const bookedDates = reservations.map((r) => ({
    startDate: r.startDate,
    endDate: r.endDate,
  }));

  res.json(bookedDates);
});

module.exports = {
  getBoats,
  getBoatById,
  searchBoats,
  getBookedDates,
};
