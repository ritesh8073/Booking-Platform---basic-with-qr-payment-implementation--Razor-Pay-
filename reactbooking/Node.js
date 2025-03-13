const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

// Mock database
let bookings = [
  { id: '1', time: '09:00 AM', available: true },
  { id: '2', time: '10:00 AM', available: true },
  { id: '3', time: '11:00 AM', available: false },
  { id: '4', time: '02:00 PM', available: true },
  { id: '5', time: '03:00 PM', available: true },
  { id: '6', time: '04:00 PM', available: true },
];

// Fetch available slots
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

// Book a slot
app.post('/api/bookings/:id', (req, res) => {
  const slotId = req.params.id;
  const slot = bookings.find((s) => s.id === slotId);
  if (slot && slot.available) {
    slot.available = false;
    res.json(slot);
  } else {
    res.status(400).send('Slot not available');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
