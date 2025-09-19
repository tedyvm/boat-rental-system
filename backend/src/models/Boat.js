const mongoose = require("mongoose");

const boatSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["Catamaran", "Sailing Yacht", "Speed Boat", "Small Boat"],
      required: true,
    },
    location: { type: String, required: true },
    year: { type: Number, required: true },
    length: { type: Number, required: true },
    cabins: { type: Number, default: 0 },
    engine: { type: Number, required: true },

    pricePerDay: { type: Number, required: true },
    capacity: { type: Number, required: true },
    withCaptain: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published"], default: "draft" },

    description: { type: String, required: true },
    images: [String],
    rating: { type: Number, default: 0 },
    numberOfReviews: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Boat", boatSchema);
