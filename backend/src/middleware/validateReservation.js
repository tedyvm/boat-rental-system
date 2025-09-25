const Reservation = require("../models/Reservation");

const validateReservation = async (req, res, next) => {
  try {
    const { boatId, startDate, endDate } = req.body;

    if (!boatId || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Boat ID, startDate and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({ message: "Cannot reserve in the past" });
    }

    if (end <= start) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (diffDays < 3) {
      return res
        .status(400)
        .json({ message: "Reservation must be at least 3 days long" });
    }

    if (diffDays > 30) {
      return res
        .status(400)
        .json({ message: "Reservation cannot exceed 30 days" });
    }

    // Tikrinam konfliktus, išskyrus redaguojamą rezervaciją
    const conflict = await Reservation.findOne({
      boat: boatId,
      status: { $in: ["pending", "paid", "active"] },
      startDate: { $lte: end },
      endDate: { $gte: start },
      ...(req.params.id ? { _id: { $ne: req.params.id } } : {}), // <- išskiriam savo rezervaciją
    });

    if (conflict) {
      return res
        .status(400)
        .json({ message: "Selected dates are not available" });
    }

    next();
  } catch (error) {
    console.error("validateReservation error:", error);
    res
      .status(500)
      .json({ message: "Internal server error during validation" });
  }
};

module.exports = validateReservation;
