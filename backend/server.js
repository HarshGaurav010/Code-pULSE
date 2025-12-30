const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let nextBookingId = 1;
let resources = [
    { id: 1, name: "Classroom A", type: "Room" },
    { id: 2, name: "Lab Projector", type: "Equipment" },
    { id: 3, name: "Library Book - DBMS", type: "Book" }
];

let bookings = [];

// Get resources
app.get("/api/resources", (req, res) => {
    res.json(resources);
});

// Get all bookings
app.get("/api/bookings", (req, res) => {
    res.json(bookings);
});

// Book resource
app.post("/api/bookings", (req, res) => {
    const { resourceId, date, start, end, role } = req.body;

    // Check for conflicts
    const conflict = bookings.find(b =>
        b.resourceId === resourceId &&
        b.date === date &&
        start < b.end &&
        end > b.start
    );

    if (conflict) {
        return res.status(400).json({ message: "Booking conflict detected!" });
    }

    const newBooking = {
        id: nextBookingId++,
        resourceId,
        date,
        start,
        end,
        role
    };

    bookings.push(newBooking);
    res.json(newBooking);
});

// Cancel booking
app.delete("/api/bookings/:id", (req, res) => {
    const id = parseInt(req.params.id);
    bookings = bookings.filter(b => b.id !== id);
    res.json({ message: "Booking cancelled" });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
