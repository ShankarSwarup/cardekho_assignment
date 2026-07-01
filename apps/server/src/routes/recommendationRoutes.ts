import { Router } from 'express';
import { generateRecommendations, getHistory } from '../controllers/RecommendationController.js';
import { authenticateJWT } from '../middleware/security.js';
import { validate } from '../middleware/validate.js';
import { recommendationSchema } from '../validators/recommendationValidator.js';

const router = Router();

router.use(authenticateJWT);

router.post('/', validate(recommendationSchema), generateRecommendations);
router.get('/history', getHistory);

export default router;
