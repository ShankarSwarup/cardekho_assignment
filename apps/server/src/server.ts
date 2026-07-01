import app from './app.js';
import mongoose from 'mongoose';
import { logger } from './middleware/logging.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI must be defined in env variables');
}
const MONGODB_URI = process.env.MONGODB_URI;

const startServer = () => {
  app.listen(PORT, () => {
    logger.info(`AutoMatch Pro Express Core API started on port ${PORT}`);
  });
};

// Disable mongoose command buffering when disconnected to prevent requests hanging
mongoose.set('bufferCommands', false);

// Establish Database Connection with MONGODB_URI only
mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('Successfully connected to MongoDB database instance');
    startServer();
  })
  .catch((err: any) => {
    logger.error(`Database connection failed: ${err.message || err}`);
    process.exit(1);
  });

// Handle global runtime failures
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Promise Rejection detected at:', {
    promise,
    reason: reason?.message || reason
  });
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception occurred:', {
    message: error.message,
    stack: error.stack
  });
  process.exit(1);
});
