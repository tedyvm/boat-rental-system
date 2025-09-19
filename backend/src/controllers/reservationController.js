const asyncHandler = require("express-async-handler");
const Reservation = require("../models/Reservation");
const Boat = require("../models/Boat");

// POST /api/reservations – create new reservation
const createReservation = asyncHandler(async (req, res) => {
  const { boatId, startDate, endDate, note } = req.body;

  // boatId, startDate, endDate jau validuoti middleware
  const boat = await Boat.findById(boatId);
  if (!boat) {
    res.status(404);
    throw new Error("Boat not found");
  }
  // 2. Suskaičiuojam dienų skaičių
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  // 3. Skaičiuojam totalPrice
  const totalPrice = days * boat.pricePerDay;

  const reservation = await Reservation.create({
    user: req.user._id,
    boat: boatId,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    note,
    totalPrice,
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
  const reservation = await Reservation.findById(req.params.id).populate(
    "boat"
  );
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

  // atnaujinam datas
  if (req.body.startDate) reservation.startDate = new Date(req.body.startDate);
  if (req.body.endDate) reservation.endDate = new Date(req.body.endDate);

  // jei pasikeitė datos → perskaičiuojam kainą
  if (req.body.startDate || req.body.endDate) {
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    reservation.totalPrice = days * reservation.boat.pricePerDay;
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
