const Booking = require('../models/Booking');
const transporter = require('../config/mailer');
const ADMIN_CONTACT_EMAIL = process.env.ADMIN_CONTACT_EMAIL;

exports.createBooking = async (req, res, next) => {
  try {
    const b = new Booking(req.body);
    await b.save();
    // send notification email to admin
    try {
      if (ADMIN_CONTACT_EMAIL) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || ADMIN_CONTACT_EMAIL,
          to: ADMIN_CONTACT_EMAIL,
          subject: `New booking request from ${b.name}`,
          text: `Name: ${b.name}\nEmail: ${b.email}\nPhone: ${b.phone || ''}\nTour: ${b.tour || ''}\nDate: ${b.date || ''}\nParty size: ${b.partySize || ''}\n\nNotes:\n${b.notes || ''}`
        });
      }
    } catch (mailErr) {
      console.error('Failed to send booking notification email', mailErr);
    }
    res.status(201).json(b);
  } catch (err) {
    next(err);
  }
};

exports.listBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('tour').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const b = await Booking.findById(req.params.id).populate('tour');
    if (!b) return res.status(404).json({ message: 'Not found' });
    res.json(b);
  } catch (err) {
    next(err);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const b = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!b) return res.status(404).json({ message: 'Not found' });
    res.json(b);
  } catch (err) {
    next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const b = await Booking.findById(req.params.id);
    if (!b) return res.status(404).json({ message: 'Not found' });
    await b.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
