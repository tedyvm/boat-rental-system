import express from "express";
import Stripe from "stripe";
import { Reservation } from "../models/Reservation.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1) CREATE SESSION
router.post("/create-session", async (req, res) => {
  try {
    const { reservationId } = req.body;
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });

    // Sukuriam Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Boat reservation (${reservation.startDate.toDateString()} → ${reservation.endDate.toDateString()})`,
            },
            unit_amount: reservation.totalPrice * 100, // centais
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?reservationId=${reservation._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-canceled`,
      metadata: { reservationId: reservation._id.toString() },
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error("❌ Stripe session error:", err);
    res.status(500).json({ error: "Failed to create payment session" });
  }
});

// 2) WEBHOOK (Stripe informuoja apie apmokėjimą)
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const reservationId = session.metadata.reservationId;

    await Reservation.findByIdAndUpdate(reservationId, { status: "confirmed" });
    console.log(`✅ Reservation ${reservationId} confirmed`);
  }

  res.sendStatus(200);
});

export default router;
