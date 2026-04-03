import { Router } from 'express';
import validate from '../../middleware/validate.middleware.js';
import { authRateLimiter } from '../../middleware/rateLimiter.middleware.js';
import { loginSchema, registerSchema, refreshTokenSchema } from './auth.validator.js';

const router = Router();

/**
 * Factory function to create auth routes using the injected controller.
 * @param {import('./auth.controller').default} authController
 */
const authRoutes = (authController) => {
  router.post(
    '/login',
    authRateLimiter,
    validate(loginSchema),
    authController.login.bind(authController)
  );

  router.post(
    '/register',
    authRateLimiter,
    validate(registerSchema),
    authController.register.bind(authController)
  );

  router.post(
    '/refresh',
    validate(refreshTokenSchema),
    authController.refresh.bind(authController)
  );

  router.post(
    '/logout',
    validate(refreshTokenSchema),
    authController.logout.bind(authController)
  );

  return router;
};

export default authRoutes;
