const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  url: { type: String, required: true },
  public_id: { type: String, required: true, unique: true },
  tags: [{ type: String }],
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', ImageSchema);
