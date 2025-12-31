const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');

const streamifier = require('streamifier');

function uploadBufferToCloudinary(buffer, folder = '') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const folder = req.body.folder || 'gwino-uploads';
    const result = await uploadBufferToCloudinary(req.file.buffer, folder);

    const image = new Image({
      title: req.body.title || req.file.originalname,
      description: req.body.description || '',
      url: result.secure_url,
      public_id: result.public_id,
      tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [],
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

exports.getImages = async (req, res, next) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    next(err);
  }
};

exports.getImage = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Not found' });
    res.json(image);
  } catch (err) {
    next(err);
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Not found' });

    // remove from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // remove from DB
    await image.remove();

    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
