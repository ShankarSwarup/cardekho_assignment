import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/index.js';
import { requestLoggerMiddleware } from './middleware/logging.js';
import { errorHandler } from './middleware/error.js';

// Extend Express Request interface for cookies
declare global {
  namespace Express {
    interface Request {
      cookies: Record<string, string>;
    }
  }
}

const app = express();

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Express Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'SYS_003',
    message: 'Too many requests, please try again later'
  }
});
app.use('/api', limiter);

// Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parsing Custom Middleware (zero dependencies)
app.use((req, res, next) => {
  const cookieHeader = req.headers.cookie;
  const list: Record<string, string> = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      const name = parts.shift()?.trim();
      if (name) {
        list[name] = decodeURIComponent(parts.join('='));
      }
    });
  }
  req.cookies = list;
  next();
});

// Structured request audit logging
app.use(requestLoggerMiddleware);

// Wire API router
app.use('/api/v1', apiRouter);

// Centralized error interceptor handler
app.use(errorHandler);

export default app;
