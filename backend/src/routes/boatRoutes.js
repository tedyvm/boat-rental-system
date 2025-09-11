const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getBoats,
  getBoatById,
  createBoat,
  updateBoat,
  deleteBoat,
} = require("../controllers/boatController");

// Public
router.get("/", getBoats);
router.get("/:id", getBoatById);

// Admin
router.post("/", protect, admin, createBoat);
router.put("/:id", protect, admin, updateBoat);
router.delete("/:id", protect, admin, deleteBoat);

module.exports = router;
