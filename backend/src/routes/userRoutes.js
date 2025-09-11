const { protect, admin } = require("../middleware/authMiddleware");
const { deleteUser } = require("../controllers/userController");
const {
  updateUser,
  updateMyProfile,
} = require("../controllers/userController");

router.put("/:id", protect, admin, updateUser); // Adminas redaguoja bet kurį
router.put("/profile", protect, updateMyProfile); // Prisijungęs redaguoja savo
router.delete("/:id", protect, admin, deleteUser); // Adminas trina bet kurį
