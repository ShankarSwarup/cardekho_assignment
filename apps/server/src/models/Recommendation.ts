import { Schema, model } from 'mongoose';
import { RecommendationSession as IRecommendationSession } from '../types/index.js';

const recommendationSchema = new Schema<IRecommendationSession>({
  userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
  preferences: {
    budget: { type: Number, required: true },
    familySize: { type: Number, required: true },
    fuel: { type: String, required: true },
    transmission: { type: String, required: true },
    dailyDistance: { type: Number, required: true },
    priority: { type: String, required: true },
    brandPreference: { type: String }
  },
  shortlistedCars: [{ type: Schema.Types.ObjectId as any, ref: 'Car' }],
  advisorExplanation: { type: String, required: true }
}, {
  timestamps: true
});

export const RecommendationModel = model<IRecommendationSession>('Recommendation', recommendationSchema);
