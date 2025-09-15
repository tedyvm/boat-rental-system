const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createOrUpdateReview,
  getBoatReviews,
  getBoatAverageRating,
  deleteReview,
} = require("../controllers/reviewController");

// Public
router.get("/boat/:boatId", getBoatReviews);
router.get("/boat/:boatId/average", getBoatAverageRating);

// USER arba delete ADMIN
router.post("/", protect, createOrUpdateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
