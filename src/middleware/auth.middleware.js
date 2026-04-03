import jwt from 'jsonwebtoken';
import config from '../config/jwt.config.js';
import { UnauthorizedError } from '../common/app-error.js';

/**
 * Middleware to verify JWT token and inject user into request object.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('No authentication token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.accessSecret);
    req.user = decoded; // { id, role, email }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Access token has expired'));
    }
    return next(new UnauthorizedError('Invalid access token'));
  }
};

export default authMiddleware;
