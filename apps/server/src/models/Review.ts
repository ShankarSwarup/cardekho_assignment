import { Schema, model } from 'mongoose';
import { Review as IReview } from '@automatch/types';

const reviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  carId: { type: Schema.Types.ObjectId as any, ref: 'Car', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true, maxlength: 1000 }
}, {
  timestamps: true
});

export const ReviewModel = model<IReview>('Review', reviewSchema);
