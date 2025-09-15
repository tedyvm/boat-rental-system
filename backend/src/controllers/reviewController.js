const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const Boat = require("../models/Boat");
const Reservation = require("../models/Reservation");
const mongoose = require("mongoose");

const recalcBoatRating = async (boatId) => {
  const objectId = new mongoose.Types.ObjectId(boatId);

  const result = await Review.aggregate([
    { $match: { boat: objectId } },
    { $group: { _id: "$boat", avgRating: { $avg: "$rating" } } },
  ]);

  const avg = result.length > 0 ? result[0].avgRating : 0;
  await Boat.findByIdAndUpdate(objectId, { rating: avg }, { new: true });
};

// @desc    Sukurti arba atnaujinti savo įvertinimą
// @route   POST /api/reviews
// @access  Private
const createOrUpdateReview = asyncHandler(async (req, res) => {
  const { boatId, rating, comment } = req.body;
  if (!boatId || !rating) {
    res.status(400);
    throw new Error("Boat ID and rating are required");
  }

  // Patikrinti ar laivas egzistuoja
  const boatExists = await Boat.findById(boatId);
  if (!boatExists) {
    res.status(404);
    throw new Error("Boat not found");
  }

  // Patikrinti ar vartotojas turi bent vieną COMPLETED rezervaciją šiam laivui
  const completedReservation = await Reservation.findOne({
    user: req.user._id,
    boat: boatId,
    status: "completed",
  });

  if (!completedReservation) {
    res.status(403);
    throw new Error("You can only review boats you have rented and completed");
  }

  // Ieškome ar user jau turi review šiam laivui
  let review = await Review.findOne({ user: req.user._id, boat: boatId });

  if (review) {
    // Atnaujina esamą review
    review.rating = rating;
    review.comment = comment || review.comment;
    await review.save();
  } else {
    // Sukuria naują review
    review = await Review.create({
      user: req.user._id,
      boat: boatId,
      rating,
      comment,
    });
  }

  await recalcBoatRating(boatId);
  const updatedBoat = await Boat.findById(boatId);

  res.status(201).json({ message: "Review saved", review, updatedBoat });
});

// @desc    Gauti visus įvertinimus laivui
// @route   GET /api/reviews/boat/:boatId
// @access  Public
const getBoatReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ boat: req.params.boatId })
    .populate("user", "username email")
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Gauti vidutinį įvertinimą laivui
// @route   GET /api/reviews/boat/:boatId/average
// @access  Public
const getBoatAverageRating = asyncHandler(async (req, res) => {
  const result = await Review.aggregate([
    { $match: { boat: req.params.boatId } },
    { $group: { _id: "$boat", avgRating: { $avg: "$rating" } } },
  ]);

  res.json({
    boatId: req.params.boatId,
    averageRating: result.length > 0 ? result[0].avgRating : 0,
  });
});

// @desc    Ištrinti savo review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Tik savininkas arba admin gali trinti
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  await review.deleteOne();
  await recalcBoatRating(review.boat);

  res.json({ message: "Review removed" });
});

module.exports = {
  createOrUpdateReview,
  getBoatReviews,
  getBoatAverageRating,
  deleteReview,
};
