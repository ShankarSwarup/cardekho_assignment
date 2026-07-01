import { Request, Response } from 'express';
import { RecommendationService } from '../services/RecommendationService.js';
import { asyncHandler } from '../middleware/error.js';

const recommendationService = new RecommendationService();

export const generateRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const result = await recommendationService.generateRecommendations(userId, req.body);

  return res.status(200).json({
    success: true,
    message: 'Smart Recommendations computed successfully',
    data: result
  });
});

export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const history = await recommendationService.getHistory(userId);

  return res.status(200).json({
    success: true,
    message: 'Recommendation sessions history retrieved',
    data: history
  });
});
