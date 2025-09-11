const mongoose = require("mongoose");

const boatSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["katamaranas", "jachta", "motorinis", "valtis"],
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    withCaptain: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

const Boat = mongoose.model("Boat", boatSchema);

module.exports = Boat;
