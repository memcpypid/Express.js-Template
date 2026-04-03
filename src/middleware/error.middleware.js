import logger from '../config/logger.config.js';
import ApiResponse from '../common/api-response.js';

/**
 * Global Error Handling Middleware
 */
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Sanitize and format Sequelize validation/unique errors
  if (Array.isArray(errors)) {
    errors = errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Log the error
  logger.error(message, {
    statusCode,
    requestId: req.requestId,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
  });

  const response = {
    success: false,
    statusCode,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

export default errorMiddleware;
