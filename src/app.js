import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { scopePerRequest } from 'awilix-express';

import { configureContainer } from './config/container.config.js';
import logger from './config/logger.config.js';
import errorMiddleware from './middleware/error.middleware.js';
import requestIdMiddleware from './middleware/requestId.middleware.js';
import { generalRateLimiter } from './middleware/rateLimiter.middleware.js';
import { NotFoundError } from './common/app-error.js';

// Module Routes
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';

dotenv.config();

const app = express();
const container = configureContainer();

/**
 * Express Middleware Setup
 */
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestIdMiddleware);

// HTTP Logging with Morgan
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    stream: { write: (message) => logger.http(message.trim()) },
  })
);

// General Rate Limiting
app.use('/api', generalRateLimiter);

// DI Container scope per request
app.use(scopePerRequest(container));

/**
 * Route Registration
 */
const apiPrefix = '/api/v1';

// Resolve controllers from container for routes
const authController = container.resolve('authController');
const userController = container.resolve('userController');

app.use(`${apiPrefix}/auth`, authRoutes(authController));
app.use(`${apiPrefix}/users`, userRoutes(userController));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

/**
 * Global Error Handler
 */
app.use(errorMiddleware);

export default app;
export { container };
