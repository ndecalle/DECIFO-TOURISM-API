const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String },
  longDescription: { type: String },
  activities: [String],
  image: { type: String },
  relatedTours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Destination', DestinationSchema);
