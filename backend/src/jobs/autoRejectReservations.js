const cron = require("node-cron");
const Reservation = require("../models/Reservation");

// 1️⃣ Pirmiausia apibrėžiam funkciją
async function autoRejectReservations() {
  const X_DAYS = 3; // kiek dienų laukti
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - X_DAYS);

  try {
    const result = await Reservation.updateMany(
      {
        status: "pending",
        createdAt: { $lte: cutoff },
      },
      { $set: { status: "rejected" } }
    );

    console.log(
      `[AUTO-REJECT] Reservations updated: ${result.modifiedCount}`
    );
  } catch (err) {
    console.error("[AUTO-REJECT] Error:", err);
  }
}

// 2️⃣ Tik tada suplanuojam cron job
cron.schedule("0 0 * * *", autoRejectReservations);

// 3️⃣ Testavimui – paleidžiam iškart (jei nori patikrinti)
autoRejectReservations();

module.exports = autoRejectReservations;
