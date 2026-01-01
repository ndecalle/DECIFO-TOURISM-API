import { Request, Response, NextFunction } from 'express';
import Destination from '../models/Destination';
import cloudinary from '../config/cloudinary';
import streamifier from 'streamifier';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  // Add other properties as needed
}

export const createDestination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: 'destinations' }, (error: any, result: any) => {
          if (error) return reject(error);
          resolve(result);
        });
        streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
      });
      data.image = uploadResult.secure_url;
    }

    const dest = new Destination(data);
    await dest.save();
    res.status(201).json(dest);
  } catch (err) {
    next(err);
  }
};

export const listDestinations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    res.json(destinations);
  } catch (err) {
    next(err);
  }
};

export const getDestination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dest = await Destination.findById(req.params.id).populate('relatedTours');
    if (!dest) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(dest);
  } catch (err) {
    next(err);
  }
};

export const updateDestination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: 'destinations' }, (error: any, result: any) => {
          if (error) return reject(error);
          resolve(result);
        });
        streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
      });
      data.image = uploadResult.secure_url;
    }

    const dest = await Destination.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!dest) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(dest);
  } catch (err) {
    next(err);
  }
};

export const deleteDestination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    await dest.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
