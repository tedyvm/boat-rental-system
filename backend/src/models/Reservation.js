const mongoose = require("mongoose");

const RES_STATUSES = [
  "pending",   // laukia admin patvirtinimo
  "approved",  // patvirtinta, dar neprasidėjo
  "rejected",  // atmesta
  "active",    // dabar vyksta
  "completed", // įvykdyta
  "cancelled", // atšaukta vartotojo ar admin
];

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    boat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: RES_STATUSES,
      default: "pending",
      index: true,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

//validacija: pabaiga turi būti po pradžios
reservationSchema.path("endDate").validate(function (value) {
  return value > this.startDate;
}, "endDate must be after startDate");

//našumui: dažnos paieškos kombinacijos
reservationSchema.index({ boat: 1, startDate: 1, endDate: 1, status: 1 });

// patikrinti ar yra konfliktų pasirinktame intervale, blokuojam paieskoje jei statusas yra pending, approved arba active
reservationSchema.statics.hasConflict = function (boatId, start, end) {
  return this.exists({
    boat: boatId,
    status: { $in: ["pending", "approved", "active"] },
    startDate: { $lte: end },
    endDate: { $gte: start },
  });
};


const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;
module.exports.RES_STATUSES = RES_STATUSES;
