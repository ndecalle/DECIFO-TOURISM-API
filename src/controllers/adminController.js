const transporter = require('../config/mailer');
const ContactMessage = require('../models/ContactMessage');

exports.replyToContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject, body: bodyText, template } = req.body;
    const msg = await ContactMessage.findById(id);
    if (!msg) return res.status(404).json({ message: 'Contact not found' });

    // simple template support
    const templates = {
      acknowledgement: `Hello ${msg.name},\n\nThank you for contacting us. We have received your message about "${msg.tourInterest || ''}" and will get back to you shortly.\n\nBest regards,\nTeam`,
      bookingInfo: `Hello ${msg.name},\n\nThank you for your booking inquiry. We will follow up with details and next steps.\n\nBest regards,\nTeam`
    };

    const finalBody = template && templates[template] ? templates[template] : (bodyText || templates['acknowledgement']);

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
