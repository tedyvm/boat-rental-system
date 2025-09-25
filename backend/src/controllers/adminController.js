const asyncHandler = require("express-async-handler");
const Boat = require("../models/Boat");
const User = require("../models/User");
const Review = require("../models/Review");
const Reservation = require("../models/Reservation");
const { recalcBoatRating } = require("./reviewController");

//USERS

const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  // Paieškos filtrai
  const filter = {};

  if (req.query.name) {
    filter.name = { $regex: req.query.name, $options: "i" };
  }

  if (req.query.familyName) {
    filter.familyName = { $regex: req.query.familyName, $options: "i" };
  }

  if (req.query.username) {
    filter.username = { $regex: req.query.username, $options: "i" };
  }

  if (req.query.role && req.query.role !== "all") {
    filter.role = req.query.role;
  }

  // Rūšiavimas
  let sortField = req.query.sortField || "createdAt";
  let sortDirection = req.query.sortDirection === "asc" ? 1 : -1;
  const sortObj = { [sortField]: sortDirection };

  // Skaičiuojame bendrą kiekį
  const count = await User.countDocuments(filter);

  // Paimame puslapį
  const users = await User.find(filter)
    .select("-password")
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    users,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});

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
  const boatExists = await Boat.findOne({ name: req.body.name });
  if (boatExists) {
    res.status(400);
    throw new Error("Boat already exists");
  }

  try {
    const boat = await Boat.create(req.body);
    res.status(201).json(boat);
  } catch (err) {
    console.error("❌ Failed to create boat:", err);
    res.status(400).json({ message: err.message });
  }
});

const getAllBoatsAdmin = asyncHandler(async (req, res) => {
  const { name, location, type, status, sortField, sortDirection, page = 1, limit = 10 } = req.query;

  const filter = {};

  if (name) filter.name = { $regex: name, $options: "i" };
  if (location) filter.location = { $regex: location, $options: "i" };
  if (type) filter.type = type;
  if (status) filter.status = status;

  // Dinaminis rūšiavimas
  let sortOption = {};
  if (sortField) {
    sortOption[sortField] = sortDirection === "asc" ? 1 : -1;
  } else {
    sortOption = { createdAt: -1 };
  }

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

  Object.assign(boat, req.body); // perrašo laukus, kuriuos atsiuntė klientas

  try {
    const updatedBoat = await boat.save();
    res.json(updatedBoat);
  } catch (err) {
    console.error("❌ Failed to update boat:", err);
    res.status(400).json({ message: err.message });
  }
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortField = req.query.sortField || "startDate";
  const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;

  const boatSearch = req.query.boat || "";
  const userSearch = req.query.user || "";
  const statuses = req.query.statuses ? req.query.statuses.split(",") : [];

  const filter = {};

  // Filtras pagal statusus
  if (statuses.length > 0) {
    filter.status = { $in: statuses };
  }

  // Filtras pagal boat name
  if (boatSearch) {
    const matchingBoats = await Boat.find({
      name: { $regex: boatSearch, $options: "i" },
    }).select("_id");
    const boatIds = matchingBoats.map((b) => b._id);
    if (boatIds.length > 0) {
      filter.boat = { $in: boatIds };
    } else {
      return res.json({ reservations: [], total: 0, page, totalPages: 0 });
    }
  }

  // Filtras pagal user username
  if (userSearch) {
    const matchingUsers = await User.find({
      username: { $regex: userSearch, $options: "i" },
    }).select("_id");
    const userIds = matchingUsers.map((u) => u._id);
    if (userIds.length > 0) {
      filter.user = { $in: userIds };
    } else {
      return res.json({ reservations: [], total: 0, page, totalPages: 0 });
    }
  }

  const total = await Reservation.countDocuments(filter);

  const reservations = await Reservation.find(filter)
    .populate("boat", "name")
    .populate("user", "username email")
    .sort({ [sortField]: sortDirection })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    reservations,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});


const updateReservationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = [
    "paid",
    "timed-out",
    "active",
    "completed",
    "cancelled",
    "pending",
  ];
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

const deleteReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    res.status(404);
    throw new Error("Reservation not found");
  }

  // Leidžiame trinti tik completed, cancelled arba timed-out
  if (!["completed", "cancelled", "timed-out"].includes(reservation.status)) {
    res.status(400);
    throw new Error(
      "Only completed, cancelled or timed-out reservations can be deleted"
    );
  }

  await reservation.deleteOne();
  res.json({ message: "Reservation deleted successfully" });
});

const getBoatByIdAdmin = asyncHandler(async (req, res) => {
  const boat = await Boat.findById(req.params.id);
  if (!boat) {
    res.status(404);
    throw new Error("Boat not found");
  }
  res.json(boat);
});

// Reviews

const getAllReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortField = req.query.sortField || "createdAt";
  const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;

  const boatSearch = req.query.boat || "";
  const userSearch = req.query.user || "";

  const filter = {};

  // --- FILTRAS pagal boat name ---
  if (boatSearch) {
    const matchingBoats = await Boat.find({
      name: { $regex: boatSearch, $options: "i" },
    }).select("_id");
    const boatIds = matchingBoats.map((b) => b._id);
    if (boatIds.length > 0) {
      filter.boat = { $in: boatIds };
    } else {
      // Jei nerasta nei vieno laivo → grąžinam tuščią atsakymą
      return res.json({ reviews: [], total: 0, page, totalPages: 0 });
    }
  }

  // --- FILTRAS pagal user username ---
  if (userSearch) {
    const matchingUsers = await User.find({
      username: { $regex: userSearch, $options: "i" },
    }).select("_id");
    const userIds = matchingUsers.map((u) => u._id);
    if (userIds.length > 0) {
      filter.user = { $in: userIds };
    } else {
      return res.json({ reviews: [], total: 0, page, totalPages: 0 });
    }
  }

  const total = await Review.countDocuments(filter);

  const reviews = await Review.find(filter)
    .populate("boat", "name")
    .populate("user", "username email")
    .sort({ [sortField]: sortDirection })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    reviews,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

const deleteReviewAdmin = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  const boatId = review.boat ? review.boat.toString() : null;

  await Review.findByIdAndDelete(req.params.id);

  if (boatId) {
    try {
      await recalcBoatRating(boatId);
    } catch (err) {
      console.error("Failed to recalc rating:", err);
    }
  }

  res.json({ message: "Review removed successfully" });
});

module.exports = {
  createBoat,
  getAllBoatsAdmin,
  updateBoat,
  deleteBoat,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  getAllReservations,
  updateReservationStatus,
  getBoatByIdAdmin,
  getAllReviews,
  deleteReviewAdmin,
  deleteReservation,
};
