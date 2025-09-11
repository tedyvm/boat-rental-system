const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getBoats,
  getBoatById,
  searchBoats,
} = require("../controllers/boatController");


// Public
router.get("/search", searchBoats);
router.get("/", getBoats);
router.get("/:id", getBoatById);


module.exports = router;
