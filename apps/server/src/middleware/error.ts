import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from './logging.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const traceId = req.traceId || 'unknown';
  
  // Log the error internally
  logger.error('Unhandled application error', {
    traceId,
    endpoint: req.originalUrl,
    method: req.method,
    message: err.message || err,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // 1. Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      code: 'VAL_002',
      message: 'Validation failed',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      })),
      traceId
    });
  }

  // 2. Handle DB Duplicate Key Errors (MongoDB code 11000)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      code: 'DB_002',
      message: 'Resource conflict: Duplicate entry detected',
      errors: [],
      traceId
    });
  }

  // 3. Handle JWT Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      code: 'AUTH_003',
      message: 'Authentication failed: Invalid or expired token',
      errors: [],
      traceId
    });
  }

  // 4. Handle standard known service errors
  const status = err.status || 500;
  const errorCode = err.code || 'SYS_001';
  const userMessage = status === 500 ? 'Internal server error occurred' : err.message;

  return res.status(status).json({
    success: false,
    code: errorCode,
    message: userMessage,
    errors: [],
    traceId
  });
};
// Helper to wrap async route handlers
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
export class AppError extends Error {
  public status: number;
  public code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class AuthenticationError extends AppError {
  constructor(message: string = 'Invalid credentials') {
    super(message, 401, 'AUTH_001');
  }
}
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400, 'VAL_001');
  }
}
