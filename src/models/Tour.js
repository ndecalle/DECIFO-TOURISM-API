const mongoose = require('mongoose');

const ItineraryItemSchema = new mongoose.Schema({
  day: { type: String },
  title: { type: String },
  description: { type: String }
}, { _id: false });

const TourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  duration: { type: String },
  price: { type: Number },
  priceText: { type: String },
  image: { type: String },
  itinerary: [ItineraryItemSchema],
  included: [String],
  notIncluded: [String],
  featured: { type: Boolean, default: false },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tour', TourSchema);
