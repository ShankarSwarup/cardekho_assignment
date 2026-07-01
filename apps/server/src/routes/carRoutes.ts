import { Router } from 'express';
import { getCars, getCarById, searchCars, compareCars, toggleWishlist, getCarFilters } from '../controllers/CarController.js';
import { authenticateJWT } from '../middleware/security.js';
import { validate } from '../middleware/validate.js';
import { carQuerySchema, carSearchSchema, carCompareSchema } from '../validators/carValidator.js';

const router = Router();

router.get('/', validate(carQuerySchema), getCars);
router.get('/filters', getCarFilters);
router.get('/search', validate(carSearchSchema), searchCars);
router.get('/compare', validate(carCompareSchema), compareCars);
router.post('/wishlist', authenticateJWT, toggleWishlist);
router.get('/:id', getCarById);

export default router;
