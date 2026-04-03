import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware to add a unique request ID (X-Request-Id) to each request and response.
 * This is useful for tracing logs across multiple services or components.
 */
const requestIdMiddleware = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};

export default requestIdMiddleware;
