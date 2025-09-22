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
  paymentSuccess,
} = require("../controllers/reservationController");

router.get("/me", protect, getMyReservations);
router.get("/:id", protect, getReservationById);
router.post("/", protect, validateReservation, createReservation);
router.put("/:id", protect, validateReservation, updateReservation);
router.put("/:id/payment-success", protect, paymentSuccess);
router.delete("/:id", protect, cancelReservation);

module.exports = router;
