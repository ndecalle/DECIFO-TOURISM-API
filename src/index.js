const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const connectDB = require('./config/db');
require('./config/cloudinary');

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(morgan('dev'));

// basic rate limiter (apply to all requests; more specific below)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// stricter limiter for contact form to reduce spam
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20 });

const uploadsRouter = require('./routes/uploads');
const toursRouter = require('./routes/tours');
const destinationsRouter = require('./routes/destinations');
const testimonialsRouter = require('./routes/testimonials');
const contactsRouter = require('./routes/contacts');
const bookingsRouter = require('./routes/bookings');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');

app.use('/api/uploads', uploadsRouter);
app.use('/api/tours', toursRouter);
app.use('/api/destinations', destinationsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// apply contactLimiter to contact POST only
app.use('/api/contacts', (req, res, next) => {
  if (req.method === 'POST') return contactLimiter(req, res, next);
  next();
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', name: 'gwino-backend' });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});
