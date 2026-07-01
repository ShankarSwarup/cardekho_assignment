import { RecommendationModel } from '../models/Recommendation.js';
import { RecommendationSession as IRecommendationSession } from '../types/index.js';

export class RecommendationRepository {
  async create(sessionData: Partial<IRecommendationSession>): Promise<IRecommendationSession> {
    const session = new RecommendationModel(sessionData);
    return session.save();
  }

  async findByUserId(userId: string): Promise<IRecommendationSession[]> {
    return RecommendationModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate('shortlistedCars')
      .exec();
  }
}
