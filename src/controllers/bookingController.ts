import { Request, Response, NextFunction } from 'express';
import Booking from '../models/Booking';
import Tour from '../models/Tour';
import transporter from '../config/mailer';

const ADMIN_CONTACT_EMAIL = process.env.ADMIN_CONTACT_EMAIL;

export const createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body: any = { ...req.body };
    // If no date provided, attempt to set from the tour's scheduled date
    if ((!body.date || body.date === '') && body.tour) {
      try {
        const tour = await Tour.findById(body.tour);
        if (tour && tour.date) body.date = tour.date;
      } catch (e) {
        // if tour lookup by id fails, try by slug
        try {
          const tourBySlug = await Tour.findOne({ slug: body.tour });
          if (tourBySlug && tourBySlug.date) body.date = tourBySlug.date;
        } catch (ignore) {}
      }
    }

    const b = new Booking(body);
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

export const listBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bookings = await Booking.find().populate('tour').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

export const getBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const b = await Booking.findById(req.params.id).populate('tour');
    if (!b) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(b);
  } catch (err) {
    next(err);
  }
};

export const updateBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const b = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!b) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(b);
  } catch (err) {
    next(err);
  }
};

export const deleteBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const b = await Booking.findById(req.params.id);
    if (!b) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    await b.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
