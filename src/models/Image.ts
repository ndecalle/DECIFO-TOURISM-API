import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
  title?: string;
  description?: string;
  url: string;
  public_id: string;
  tags?: string[];
  metadata?: any;
  createdAt: Date;
}

const ImageSchema: Schema<IImage> = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  url: { type: String, required: true },
  public_id: { type: String, required: true, unique: true },
  tags: [{ type: String }],
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IImage>('Image', ImageSchema);
