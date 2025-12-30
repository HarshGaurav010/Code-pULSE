const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(bodyParser.json());

// ===============================
// DATA (TEMP STORAGE)
// ===============================
let nextBookingId = 1;

let resources = [
  { id: 1, name: "Classroom A", type: "Room" },
  { id: 2, name: "Lab Projector", type: "Equipment" },
  { id: 3, name: "Library Book - DBMS", type: "Book" }
];

let bookings = [];

// ===============================
// ROUTES
// ===============================

// Get all resources
app.get("/resources", (req, res) => {
  res.json(resources);
});

// Add new resource (Admin)
app.post("/resources", (req, res) => {
  const { name, type } = req.body;

  const newResource = {
    id: resources.length + 1,
    name,
    type
  };

  resources.push(newResource);
  res.json(newResource);
});

// Get all bookings
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// Book a resource
app.post("/bookings", (req, res) => {
  const { resourceId, date, startTime, endTime, role } = req.body;

  const conflict = bookings.find(b =>
    b.resourceId == resourceId &&
    b.date === date &&
    startTime < b.endTime &&
    endTime > b.startTime
  );

  if (conflict) {
    return res.status(400).json({ message: "Booking conflict detected!" });
  }

  const newBooking = {
    id: nextBookingId++,
    resourceId,
    date,
    startTime,
    endTime,
    role
  };

  bookings.push(newBooking);
  res.json(newBooking);
});

// Cancel booking
app.delete("/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  bookings = bookings.filter(b => b.id !== id);
  res.json({ message: "Booking cancelled" });
});

// ===============================
// START SERVER (RENDER SAFE)
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
