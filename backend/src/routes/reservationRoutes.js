const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const validateReservation = require("../middleware/validateReservation");
const {
  createReservation,
  getMyReservations,
  getReservationById,
  updateReservation,
  cancelReservation,
} = require("../controllers/reservationController");

router.get("/me", protect, getMyReservations);
router.get("/:id", protect, getReservationById);
router.post("/", protect, validateReservation, createReservation);
router.put("/:id", protect, validateReservation, updateReservation);
router.delete("/:id", protect, cancelReservation);

module.exports = router;
