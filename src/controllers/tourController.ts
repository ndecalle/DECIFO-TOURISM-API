import { Request, Response, NextFunction } from 'express';
import Tour from '../models/Tour';
import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  // Add other properties as needed
}

export const createTour = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = { ...req.body };
    // if a file was uploaded directly with the tour, upload to Cloudinary
    if (req.file) {
      const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: 'tours' }, (error: any, result: CloudinaryUploadResult) => {
          if (error) return reject(error);
          resolve(result);
        });
        streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
      });
      data.image = uploadResult.secure_url;
    }

    const tour = new Tour(data);
    await tour.save();
    res.status(201).json(tour);
  } catch (err) {
    next(err);
  }
};

export const listTours = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = '1', limit = '20', featured } = req.query as { page?: string; limit?: string; featured?: string };
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const filter: any = {};
    if (featured) filter.featured = featured === 'true';
    const tours = await Tour.find(filter)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ createdAt: -1 });
    res.json(tours);
  } catch (err) {
    next(err);
  }
};

export const getTour = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(tour);
  } catch (err) {
    next(err);
  }
};

export const updateTour = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: 'tours' }, (error: any, result: any) => {
          if (error) return reject(error);
          resolve(result);
        });
        streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
      });
      data.image = uploadResult.secure_url;
    }

    const tour = await Tour.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!tour) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(tour);
  } catch (err) {
    next(err);
  }
};

export const deleteTour = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    await tour.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
