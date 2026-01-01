import express, { Request, Response, NextFunction, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
// @ts-ignore
import xss from 'xss-clean';
import connectDB from './config/db';
import './config/cloudinary';

dotenv.config();

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(morgan('dev'));

// Basic rate limiter (apply to all requests; more specific below)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

// Stricter limiter for contact form to reduce spam
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20 });

import uploadsRouter from './routes/uploads';
import toursRouter from './routes/tours';
import destinationsRouter from './routes/destinations';
import testimonialsRouter from './routes/testimonials';
import contactsRouter from './routes/contacts';
import bookingsRouter from './routes/bookings';
import authRouter from './routes/auth';
import adminRouter from './routes/admin';

app.use('/api/uploads', uploadsRouter);
app.use('/api/tours', toursRouter);
app.use('/api/destinations', destinationsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// Apply contactLimiter to contact POST only
app.use('/api/contacts', (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST') return contactLimiter(req, res, next);
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok', name: 'gwino-backend' });
});

const PORT: string | number = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });

// Basic error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status((err as any).status || 500).json({ message: err.message || 'Internal server error' });
});
