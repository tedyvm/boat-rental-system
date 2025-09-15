const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createReservation,
  getMyReservations,
  getReservationById,
  updateReservation,
  cancelReservation,
} = require("../controllers/reservationController");

router.post("/", protect, createReservation);  // <-- svarbu
router.get("/me", protect, getMyReservations);
router.get("/:id", protect, getReservationById);
router.put("/:id", protect, updateReservation);
router.delete("/:id", protect, cancelReservation);

module.exports = router;
