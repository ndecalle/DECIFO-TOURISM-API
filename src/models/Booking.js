const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  date: { type: Date },
  partySize: { type: Number, default: 1 },
  notes: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
