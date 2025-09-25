const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createBoat,
  getAllBoatsAdmin,
  updateBoat,
  deleteBoat,
  updateUser,
  deleteUser,
  getAllReservations,
  updateReservationStatus,
  deleteReservation,
  getBoatByIdAdmin,
  getAllUsers,
  getUserById,
  getAllReviews,
  deleteReviewAdmin,
  getTopReservedBoats,
  getReservationById,
} = require("../controllers/adminController");

// USERS

router.get("/users", protect, admin, getAllUsers);
router.get("/users/:id", protect, admin, getUserById);
router.put("/users/:id", protect, admin, updateUser); // Adminas redaguoja bet kurį
router.delete("/users/:id", protect, admin, deleteUser); // Adminas trina bet kurį

// RESERVATIONS
router.get("/reservations", protect, admin, getAllReservations);
router.get("/reservations/:id", protect, admin, getAllReservations);
router.put("/reservations/:id/status", protect, admin, updateReservationStatus);
router.delete("/reservations/:id", protect, admin, deleteReservation);

// BOATS
router.get("/boats", protect, admin, getAllBoatsAdmin);
router.get("/boats/:id", protect, admin, getBoatByIdAdmin);
router.post("/boats", protect, admin, createBoat);
router.put("/boats/:id", protect, admin, updateBoat);
router.delete("/boats/:id", protect, admin, deleteBoat);

// REVIEWS
router.get("/reviews", protect, admin, getAllReviews);
router.delete("/reviews/:id", protect, admin, deleteReviewAdmin);

//Raports
router.get("/reports/top-reserved-boats", protect, admin, getTopReservedBoats);

module.exports = router;
