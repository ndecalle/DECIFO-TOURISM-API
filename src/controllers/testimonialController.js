const Testimonial = require('../models/Testimonial');

exports.createTestimonial = async (req, res, next) => {
  try {
    const t = new Testimonial(req.body);
    await t.save();
    res.status(201).json(t);
  } catch (err) {
    next(err);
  }
};

exports.listTestimonials = async (req, res, next) => {
  try {
    const { approved } = req.query;
    const filter = {};
    if (approved) filter.approved = approved === 'true';
    const items = await Testimonial.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.updateTestimonial = async (req, res, next) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return res.status(404).json({ message: 'Not found' });
    res.json(t);
  } catch (err) {
    next(err);
  }
};

exports.deleteTestimonial = async (req, res, next) => {
  try {
    const t = await Testimonial.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Not found' });
    await t.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
