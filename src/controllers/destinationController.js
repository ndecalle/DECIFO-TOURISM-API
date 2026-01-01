const Destination = require('../models/Destination');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

exports.createDestination = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: 'destinations' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
      data.image = uploadResult.secure_url;
    }

    const dest = new Destination(data);
    await dest.save();
    res.status(201).json(dest);
  } catch (err) {
    next(err);
  }
};

exports.listDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    res.json(destinations);
  } catch (err) {
    next(err);
  }
};

exports.getDestination = async (req, res, next) => {
  try {
    const dest = await Destination.findById(req.params.id).populate('relatedTours');
    if (!dest) return res.status(404).json({ message: 'Not found' });
    res.json(dest);
  } catch (err) {
    next(err);
  }
};

exports.updateDestination = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: 'destinations' }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
      data.image = uploadResult.secure_url;
    }

    const dest = await Destination.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!dest) return res.status(404).json({ message: 'Not found' });
    res.json(dest);
  } catch (err) {
    next(err);
  }
};

exports.deleteDestination = async (req, res, next) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Not found' });
    await dest.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
