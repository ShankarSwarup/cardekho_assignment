import { Schema, model } from 'mongoose';
import { Car as ICar } from '@automatch/types';

const carSchema = new Schema<ICar>({
  make: { type: String, required: true, index: true },
  model: { type: String, required: true, index: true },
  variant: { type: String, required: true },
  year: { type: Number, required: true },
  bodyType: { type: String, required: true, index: true },
  fuelType: { type: String, required: true, index: true },
  transmission: { type: String, required: true },
  engine: { type: String, required: true },
  mileage: { type: Number, required: true },
  safetyRating: { type: Number, required: true },
  seatingCapacity: { type: Number, required: true },
  price: { type: Number, required: true, index: true },
  images: [{ type: String }]
}, {
  timestamps: true
});

// Compound Index on make & model
carSchema.index({ make: 1, model: 1 });

export const CarModel = model<ICar>('Car', carSchema);
