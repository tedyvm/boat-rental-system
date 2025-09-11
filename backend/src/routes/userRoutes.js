const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { deleteUser } = require("../controllers/userController");
const {
  updateMyProfile,
} = require("../controllers/userController");

router.put("/profile", protect, updateMyProfile); // Prisijungęs redaguoja savo

module.exports = router;