const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createBoat,
  getAllBoatsAdmin,
  updateBoat,
  deleteBoat,
  updateUser,
  deleteUser, getAllReservations, updateReservationStatus,
  getBoatByIdAdmin,
} = require("../controllers/adminController");

// USERS
router.put("/users/:id", protect, admin, updateUser); // Adminas redaguoja bet kurį
router.delete("/users/:id", protect, admin, deleteUser); // Adminas trina bet kurį

// RESERVATIONS
router.get("/reservations", protect, admin, getAllReservations);
router.put("/reservations/:id/status", protect, admin, updateReservationStatus);

// BOATS
router.get("/boats", protect, admin, getAllBoatsAdmin);
router.get("/boats/:id", protect, admin, getBoatByIdAdmin);
router.post("/boats", protect, admin, createBoat);
router.put("/boats/:id", protect, admin, updateBoat);
router.delete("/boats/:id", protect, admin, deleteBoat);

module.exports = router;
