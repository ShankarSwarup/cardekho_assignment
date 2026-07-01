import { Request, Response } from 'express';
import { ReviewRepository } from '../repositories/ReviewRepository.js';
import { asyncHandler } from '../middleware/error.js';

const reviewRepository = new ReviewRepository();

export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const { id: carId } = req.params;
  const reviews = await reviewRepository.findByCarId(carId);

  return res.status(200).json({
    success: true,
    message: 'Reviews retrieved successfully',
    data: reviews
  });
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { id: carId } = req.params;
  const userId = req.userId!;
  const { rating, review } = req.body;

  const existing = await reviewRepository.findByUserAndCar(userId, carId);
  if (existing) {
    const updatedReview = await reviewRepository.update(existing._id, rating, review);
    return res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  }

  const newReview = await reviewRepository.create({
    userId,
    carId,
    rating,
    review
  });

  return res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: newReview
  });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId!;

  const existing = await reviewRepository.findById(id);
  if (!existing) {
    return res.status(404).json({
      success: false,
      code: 'REV_001',
      message: 'Review not found',
      errors: [],
      traceId: req.traceId
    });
  }

  // Ensure owner is the one deleting (Authorization check)
  if (existing.userId.toString() !== userId && req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      code: 'AUTHZ_001',
      message: 'Access denied: You cannot delete reviews owned by others',
      errors: [],
      traceId: req.traceId
    });
  }

  await reviewRepository.delete(id);
  return res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
    data: {}
  });
});
