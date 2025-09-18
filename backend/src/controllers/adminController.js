const asyncHandler = require("express-async-handler");
const Boat = require("../models/Boat");
const User = require("../models/User");
const Reservation = require("../models/Reservation");

//USERS
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  if (req.body.role) {
    user.role = req.body.role; // tik admin gali keisti rolę
  }

  const updated = await user.save();
  res.json({
    _id: updated._id,
    username: updated.username,
    email: updated.email,
    role: updated.role,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.json({ message: "User removed successfully" });
});

// BOATS
const createBoat = asyncHandler(async (req, res) => {
  const {
    type,
    name,
    description,
    pricePerDay,
    capacity,
    withCaptain,
    images,
    status,
  } = req.body;

  const boatExists = await Boat.findOne({ name });
  if (boatExists) {
    res.status(400);
    throw new Error("Boat already exists");
  }

  const boat = await Boat.create({
    type,
    name,
    description,
    pricePerDay,
    capacity,
    withCaptain,
    images,
    status: status || "draft",
  });

  res.status(201).json(boat);
});

const getAllBoatsAdmin = asyncHandler(async (req, res) => {
  const { search, type, status, sort, page = 1, limit = 10 } = req.query;

  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" }; // paieška pagal pavadinimą
  }
  if (type) filter.type = type;
  if (status) filter.status = status;

  let sortOption = {};
  if (sort === "price-asc") sortOption = { pricePerDay: 1 };
  if (sort === "price-desc") sortOption = { pricePerDay: -1 };
  if (sort === "capacity-asc") sortOption = { capacity: 1 };
  if (sort === "capacity-desc") sortOption = { capacity: -1 };
  if (!sort) sortOption = { createdAt: -1 }; // naujausi viršuje

  const skip = (Number(page) - 1) * Number(limit);

  const [boats, total] = await Promise.all([
    Boat.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
    Boat.countDocuments(filter),
  ]);

  res.json({
    boats,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

const updateBoat = asyncHandler(async (req, res) => {
  const boat = await Boat.findById(req.params.id);
  if (!boat) {
    res.status(404);
    throw new Error("Boat not found");
  }

  const {
    type,
    name,
    description,
    pricePerDay,
    capacity,
    withCaptain,
    images,
    status,
  } = req.body;

  boat.type = type || boat.type;
  boat.name = name || boat.name;
  boat.description = description || boat.description;
  boat.pricePerDay = pricePerDay || boat.pricePerDay;
  boat.capacity = capacity || boat.capacity;
  boat.withCaptain = withCaptain !== undefined ? withCaptain : boat.withCaptain;
  boat.images = images || boat.images;
  boat.status = status || boat.status;

  const updatedBoat = await boat.save();
  res.json(updatedBoat);
});

const deleteBoat = asyncHandler(async (req, res) => {
  const boat = await Boat.findById(req.params.id);
  if (!boat) {
    res.status(404);
    throw new Error("Boat not found");
  }

  await Boat.findByIdAndDelete(req.params.id);

  res.json({ message: "Boat removed successfully" });
});

// RESERVATIONS

const getAllReservations = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.boatId) filter.boat = req.query.boatId;
  if (req.query.userId) filter.user = req.query.userId;

  const reservations = await Reservation.find(filter)
    .populate("boat", "name type")
    .populate("user", "username email")
    .sort({ startDate: 1 });

  res.json(reservations);
});

const updateReservationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["approved", "rejected", "active", "completed", "cancelled"];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    res.status(404);
    throw new Error("Reservation not found");
  }

  reservation.status = status;
  await reservation.save();
  res.json(reservation);
});
const getBoatByIdAdmin = asyncHandler(async (req, res) => {
  const boat = await Boat.findById(req.params.id);
  if (!boat) {
    res.status(404);
    throw new Error("Boat not found");
  }
  res.json(boat);
});

module.exports = {
  createBoat,
  getAllBoatsAdmin,
  updateBoat,
  deleteBoat,
  updateUser,
  deleteUser,
  getAllReservations,
  updateReservationStatus,
  getBoatByIdAdmin,
};
