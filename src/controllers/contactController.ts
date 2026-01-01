import { Request, Response, NextFunction } from 'express';
import ContactMessage from '../models/ContactMessage';
import transporter from '../config/mailer';

const ADMIN_CONTACT_EMAIL = process.env.ADMIN_CONTACT_EMAIL;

export const createContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const msg = new ContactMessage(req.body);
    await msg.save();

    // send notification email to admin
    try {
      if (ADMIN_CONTACT_EMAIL) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || ADMIN_CONTACT_EMAIL,
          to: ADMIN_CONTACT_EMAIL,
          subject: `New contact message from ${msg.name}`,
          text: `Name: ${msg.name}\nEmail: ${msg.email}\nPhone: ${msg.phone || ''}\nTour interest: ${msg.tourInterest || ''}\n\nMessage:\n${msg.message}`
        });
      }
    } catch (mailErr) {
      console.error('Failed to send contact notification email', mailErr);
    }
    res.status(201).json(msg);
  } catch (err) {
    next(err);
  }
};

export const listContacts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

export const updateContactStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!msg) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(msg);
  } catch (err) {
    next(err);
  }
};
