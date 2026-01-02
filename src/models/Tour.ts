import mongoose, { Document, Schema } from 'mongoose';

export interface IItineraryItem {
  day?: string;
  title?: string;
  description?: string;
}

export interface ITour extends Document {
  title: string;
  slug: string;
  description?: string;
  duration?: string;
  price?: number;
  priceText?: string;
  image?: string;
  itinerary?: IItineraryItem[];
  included?: string[];
  notIncluded?: string[];
  featured: boolean;
  tags?: string[];
  createdAt?: Date;
  date?: Date;
}

const ItineraryItemSchema: Schema<IItineraryItem> = new mongoose.Schema({
  day: { type: String },
  title: { type: String },
  description: { type: String }
}, { _id: false });

const TourSchema: Schema<ITour> = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  duration: { type: String },
  price: { type: Number },
  priceText: { type: String },
  image: { type: String },
  itinerary: [ItineraryItemSchema],
  included: [String],
  notIncluded: [String],
  featured: { type: Boolean, default: false },
  tags: [String],
  date: { type: Date },
}, { timestamps: true });

export default mongoose.model<ITour>('Tour', TourSchema);
