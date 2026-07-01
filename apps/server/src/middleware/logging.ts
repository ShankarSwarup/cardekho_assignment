import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import crypto from 'crypto';

// Setup Winston logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Extend Express Request interface to hold traceId
declare global {
  namespace Express {
    interface Request {
      traceId?: string;
      userId?: string;
      userRole?: string;
    }
  }
}

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const traceId = (req.headers['x-trace-id'] as string) || crypto.randomUUID();
  req.traceId = traceId;
  res.setHeader('x-trace-id', traceId);

  const startTime = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    // Log the request structured format
    logger.info('API Request logged', {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      traceId,
      endpoint: req.originalUrl,
      method: req.method,
      statusCode: res.statusCode,
      responseTime,
      userId: req.userId || 'anonymous'
    });
  });

  next();
};
