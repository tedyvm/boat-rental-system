const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    boat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);

// Unikalus indeksas: vienas user gali palikti tik vieną review per laivą
reviewSchema.index({ user: 1, boat: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
