const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { getBoats, createBoat } = require("../controllers/boatController");

router.get("/", protect, getBoats); // tik prisijungęs vartotojas
router.post("/", protect, admin, createBoat); // tik admin gali kurti

module.exports = router;
