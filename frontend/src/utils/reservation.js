// utils/reservation.js

export async function createReservation({ boatId, startDate, endDate }) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in to reserve a boat.");
  }

  const response = await fetch("http://localhost:5000/api/reservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      boatId,
      startDate,
      endDate,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    throw new Error(errData?.message || "Reservation failed");
  }

  return await response.json();
}
