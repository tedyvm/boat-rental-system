const asyncHandler = require('express-async-handler');
const Boat = require('../models/Boat');

const createBoat = asyncHandler(async (req, res) => {
  const { type, name, description, pricePerDay, capacity, withCaptain, images } = req.body;

  const boatExists = await Boat.findOne({ name });
  if (boatExists) {
    res.status(400);
    throw new Error('Boat already exists');
  }

  const boat = await Boat.create({
    type,
    name,
    description,
    pricePerDay,
    capacity,
    withCaptain,
    images,
    status: 'published',
  });

  res.status(201).json(boat);
});

const getBoats = asyncHandler(async (req, res) => {
  const boats = await Boat.find({});
  res.json(boats);
});

const getBoatById = asyncHandler(async (req, res) => {
  const boat = await Boat.findById(req.params.id);
  if (!boat) {
    res.status(404);
    throw new Error('Boat not found');
  }
  res.json(boat);
});

const updateBoat = asyncHandler(async (req, res) => {
  const boat = await Boat.findById(req.params.id);
  if (!boat) {
    res.status(404);
    throw new Error('Boat not found');
  }

  const { type, name, description, pricePerDay, capacity, withCaptain, images, status } = req.body;

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
    throw new Error('Boat not found');
  }

  await boat.remove();
  res.json({ message: 'Boat removed successfully' });
});

module.exports = {
  createBoat,
  getBoats,
  getBoatById,
  updateBoat,
  deleteBoat,
};
