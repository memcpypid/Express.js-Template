import { ForbiddenError } from '../common/app-error.js';

/**
 * Middleware for RBAC role checking.
 * @param {string[]} allowedRoles
 */
const roleGuard = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new ForbiddenError('You do not have access to this resource'));
  }
  next();
};

export default roleGuard;
