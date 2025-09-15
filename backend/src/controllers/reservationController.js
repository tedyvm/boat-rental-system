const asyncHandler = require("express-async-handler");
const Reservation = require("../models/Reservation");
const Boat = require("../models/Boat");

// POST /api/reservations – create new reservation
const createReservation = asyncHandler(async (req, res) => {
  const { boatId, startDate, endDate, note } = req.body;

  if (!boatId || !startDate || !endDate) {
    res.status(400);
    throw new Error("boatId, startDate and endDate are required");
  }

  const boat = await Boat.findById(boatId);
  if (!boat) {
    res.status(404);
    throw new Error("Boat not found");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start < new Date()) {
    res.status(400);
    throw new Error("Cannot reserve in the past");
  }
  if (end <= start) {
    res.status(400);
    throw new Error("End date must be after start date");
  }

  // conflict check (pending blocks too)
  const conflict = await Reservation.hasConflict(boatId, start, end);
  if (conflict) {
    res.status(400);
    throw new Error("Boat is not available for selected dates");
  }

  const reservation = await Reservation.create({
    user: req.user._id,
    boat: boatId,
    startDate: start,
    endDate: end,
    note,
    status: "pending",
  });

  res.status(201).json(reservation);
});

// GET /api/reservations/me – get logged-in user's reservations
const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id })
    .populate("boat", "name type pricePerDay")
    .sort({ startDate: 1 });

  res.json(reservations);
});

// GET /api/reservations/:id – get single reservation (user or admin)
const getReservationById = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id)
    .populate("boat")
    .populate("user", "username email");

  if (!reservation) {
    res.status(404);
    throw new Error("Reservation not found");
  }

  // tik savininkas arba admin gali matyti
  if (
    reservation.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to view this reservation");
  }

  res.json(reservation);
});

// PUT /api/reservations/:id – update dates (only if pending)
const updateReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    res.status(404);
    throw new Error("Reservation not found");
  }

  if (
    reservation.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  if (reservation.status !== "pending") {
    res.status(400);
    throw new Error("Only pending reservations can be updated");
  }

  const { startDate, endDate } = req.body;
  if (startDate) reservation.startDate = new Date(startDate);
  if (endDate) reservation.endDate = new Date(endDate);

  const conflict = await Reservation.hasConflict(
    reservation.boat,
    reservation.startDate,
    reservation.endDate
  );
  if (conflict) {
    res.status(400);
    throw new Error("Boat is not available for new dates");
  }

  await reservation.save();
  res.json(reservation);
});

// DELETE /api/reservations/:id – cancel reservation
const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    res.status(404);
    throw new Error("Reservation not found");
  }

  if (
    reservation.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  reservation.status = "cancelled";
  await reservation.save();
  res.json({ message: "Reservation cancelled" });
});


module.exports = {
  createReservation,
  getMyReservations,
  getReservationById,
  updateReservation,
  cancelReservation,
};
