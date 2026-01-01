import { Request, Response, NextFunction } from 'express';
import Testimonial from '../models/Testimonial';

export const createTestimonial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const t = new Testimonial(req.body);
    await t.save();
    res.status(201).json(t);
  } catch (err) {
    next(err);
  }
};

export const listTestimonials = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { approved } = req.query as { approved?: string };
    const filter: any = {};
    if (approved) filter.approved = approved === 'true';
    const items = await Testimonial.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

export const updateTestimonial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(t);
  } catch (err) {
    next(err);
  }
};

export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const t = await Testimonial.findById(req.params.id);
    if (!t) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    await t.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
