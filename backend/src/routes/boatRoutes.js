const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getBoats,
  getBoatById,
  searchBoats,
  getBookedDates,
  getFilterLimits,
} = require("../controllers/boatController");

// Public

router.get("/", getBoats);
router.get("/search", searchBoats);
router.get("/filter-limits", getFilterLimits);
router.get("/:id", getBoatById);
router.get("/:id/booked-dates", getBookedDates);

module.exports = router;
