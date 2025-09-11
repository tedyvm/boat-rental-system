const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const boatRoutes = require("./routes/boatRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { protect, admin } = require("./middleware/authMiddleware");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/boats", boatRoutes);
app.use("/api/admin", adminRoutes);

  



// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Server running on port 5000")
    );
  })
  .catch((err) => console.error(err));

app.get("/api/test", protect, (req, res) => {
  res.json({ message: `Hello ${req.user.username}!` });
});
