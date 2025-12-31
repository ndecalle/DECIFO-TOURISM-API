const Tour = require('../models/Tour');

exports.createTour = async (req, res, next) => {
  try {
    const tour = new Tour(req.body);
    await tour.save();
    res.status(201).json(tour);
  } catch (err) {
    next(err);
  }
};

exports.listTours = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, featured } = req.query;
    const filter = {};
    if (featured) filter.featured = featured === 'true';
    const tours = await Tour.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    res.json(tours);
  } catch (err) {
    next(err);
  }
};

exports.getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Not found' });
    res.json(tour);
  } catch (err) {
    next(err);
  }
};

exports.updateTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tour) return res.status(404).json({ message: 'Not found' });
    res.json(tour);
  } catch (err) {
    next(err);
  }
};

exports.deleteTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Not found' });
    await tour.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
