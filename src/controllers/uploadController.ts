import cloudinary from '../config/cloudinary';
import Image, { IImage } from '../models/Image';
// @ts-ignore
import streamifier from 'streamifier';
import { Request, Response, NextFunction } from 'express';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  bytes: number;
  format: string;
}

function uploadBufferToCloudinary(buffer: Buffer, folder: string = ''): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error: any, result: any) => {
        if (error) return reject(error);
        resolve(result as CloudinaryUploadResult);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export const uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const folder = req.body.folder || 'gwino-uploads';
    const result = await uploadBufferToCloudinary(req.file.buffer, folder);

    const image = new Image({
      title: req.body.title || req.file.originalname,
      description: req.body.description || '',
      url: result.secure_url,
      public_id: result.public_id,
      tags: req.body.tags ? req.body.tags.split(',').map((t: string) => t.trim()) : [],
      metadata: {
        bytes: result.bytes,
        format: result.format
      }
    });

    await image.save();

    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
};

export const getImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    next(err);
  }
};

export const getImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(image);
  } catch (err) {
    next(err);
  }
};

export const deleteImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    // remove from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // remove from DB
    await image.deleteOne();

    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
