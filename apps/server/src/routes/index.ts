import { Router } from 'express';
import authRoutes from './authRoutes.js';
import carRoutes from './carRoutes.js';
import recommendationRoutes from './recommendationRoutes.js';
import reviewRoutes from './reviewRoutes.js';

const router = Router();

// Liveness/Readiness Health Check
router.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'System healthy',
    data: { status: 'UP' }
  });
});

// Mount modular sub-routes
router.use('/auth', authRoutes);
router.use('/cars', carRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/', reviewRoutes); // Mounts /reviews/:id and /cars/:id/reviews directly

// Handle unresolved API routes
router.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    code: 'SYS_002',
    message: 'API Endpoint not found',
    errors: [],
    traceId: req.traceId
  });
});

export default router;
