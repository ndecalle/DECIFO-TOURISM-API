const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  tourInterest: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'seen', 'responded'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ContactMessage', ContactMessageSchema);
