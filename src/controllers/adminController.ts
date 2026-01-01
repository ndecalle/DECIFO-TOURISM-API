import { Request, Response, NextFunction } from 'express';
import transporter from '../config/mailer';
import ContactMessage from '../models/ContactMessage';

export const replyToContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { subject, body: bodyText, template } = req.body;
    const msg = await ContactMessage.findById(id);
    if (!msg) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    // simple template support
    const templates: Record<string, string> = {
      acknowledgement: `Hello ${msg.name},\n\nThank you for contacting us. We have received your message about "${msg.tourInterest || ''}" and will get back to you shortly.\n\nBest regards,\nTeam`,
      bookingInfo: `Hello ${msg.name},\n\nThank you for your booking inquiry. We will follow up with details and next steps.\n\nBest regards,\nTeam`
    };

    const finalBody = template && templates[template as string] ? templates[template as string] : (bodyText || templates['acknowledgement']);

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.ADMIN_CONTACT_EMAIL,
      to: msg.email,
      subject: subject || `Re: your inquiry`,
      text: finalBody
    });

    res.json({ message: 'Reply sent' });
  } catch (err) {
    next(err);
  }
};
