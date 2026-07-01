import { Router } from 'express';
import { getReviews, createReview, deleteReview } from '../controllers/ReviewController.js';
import { authenticateJWT } from '../middleware/security.js';
import { validate } from '../middleware/validate.js';
import { reviewSchema } from '../validators/reviewValidator.js';

const router = Router();

// Public route to fetch reviews for a vehicle
router.get('/cars/:id/reviews', getReviews);

// Protected routes to modify reviews
router.post('/cars/:id/reviews', authenticateJWT, validate(reviewSchema), createReview);
router.delete('/reviews/:id', authenticateJWT, deleteReview);

export default router;
