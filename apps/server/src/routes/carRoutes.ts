import { Router } from 'express';
import { getCars, getCarById, searchCars, compareCars, toggleWishlist, getCarFilters, getWishlist } from '../controllers/CarController.js';
import { authenticateJWT } from '../middleware/security.js';
import { validate } from '../middleware/validate.js';
import { carQuerySchema, carSearchSchema, carCompareSchema } from '../validators/carValidator.js';

const router = Router();

router.get('/', validate(carQuerySchema), getCars);
router.get('/filters', getCarFilters);
router.get('/search', validate(carSearchSchema), searchCars);
router.get('/compare', validate(carCompareSchema), compareCars);
router.get('/wishlist', authenticateJWT, getWishlist);
router.post('/wishlist', authenticateJWT, toggleWishlist);
router.get('/:id', getCarById);

export default router;
