const Destination = require('../models/Destination');

exports.createDestination = async (req, res, next) => {
  try {
    const dest = new Destination(req.body);
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
    const dest = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
