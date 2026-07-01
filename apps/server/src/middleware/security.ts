import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService.js';

const authService = new AuthService();

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      code: 'AUTH_004',
      message: 'Missing or malformed authorization token',
      errors: [],
      traceId: req.traceId
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = authService.verifyAccessToken(token);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      code: 'AUTH_003',
      message: 'Token is expired or invalid',
      errors: [],
      traceId: req.traceId
    });
  }
};

export const requireRole = (roles: ('user' | 'admin')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole as any)) {
      return res.status(403).json({
        success: false,
        code: 'AUTHZ_001',
        message: 'Access denied: Insufficient privileges',
        errors: [],
        traceId: req.traceId
      });
    }
    next();
  };
};
