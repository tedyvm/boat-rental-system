const asyncHandler = require("express-async-handler");
const Boat = require("../models/Boat");
const User = require("../models/User");

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
const getAllBoatsAdmin = asyncHandler(async (req, res) => {
  const boats = await Boat.find({});
  res.json(boats);
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

  await boat.remove();
  res.json({ message: "Boat removed successfully" });
});

module.exports = {
  createBoat,
  getAllBoatsAdmin,
  updateBoat,
  deleteBoat,
  updateUser,
  deleteUser,
};
