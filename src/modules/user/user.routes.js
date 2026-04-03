import { Router } from 'express';
import authMiddleware from '../../middleware/auth.middleware.js';
import roleGuard from '../../middleware/role.middleware.js';
import validate from '../../middleware/validate.middleware.js';
import { ROLES } from '../../common/constants/roles.js';
import { createUserSchema, updateUserSchema, updateProfileSchema, userIdSchema } from './user.validator.js';

const router = Router();

/**
 * Factory function to create user routes using the injected controller.
 * @param {import('./user.controller').default} userController
 */
const userRoutes = (userController) => {
  // Get own profile
  router.get(
    '/me',
    authMiddleware,
    userController.getOwnProfile.bind(userController)
  );

  // Update own profile
  router.put(
    '/me',
    authMiddleware,
    validate(updateProfileSchema),
    userController.updateOwnProfile.bind(userController)
  );

  // ADMIN ONLY: List all users
  router.get(
    '/',
    authMiddleware,
    roleGuard([ROLES.ADMIN]),
    userController.getAllUsers.bind(userController)
  );

  // ADMIN ONLY: Create user
  router.post(
    '/',
    authMiddleware,
    roleGuard([ROLES.ADMIN]),
    validate(createUserSchema),
    userController.createUser.bind(userController)
  );

  // ADMIN OR SELF: Get user detail (Role check logic inside controller or middleware)
  router.get(
    '/:id',
    authMiddleware,
    validate(userIdSchema),
    userController.getUserById.bind(userController)
  );

  // ADMIN ONLY: Update user
  router.put(
    '/:id',
    authMiddleware,
    roleGuard([ROLES.ADMIN]),
    validate(updateUserSchema),
    userController.updateUser.bind(userController)
  );

  // ADMIN ONLY: Delete user
  router.delete(
    '/:id',
    authMiddleware,
    roleGuard([ROLES.ADMIN]),
    validate(userIdSchema),
    userController.deleteUser.bind(userController)
  );

  // ADMIN ONLY: Activate account
  router.patch(
    '/:id/activate',
    authMiddleware,
    roleGuard([ROLES.ADMIN]),
    validate(userIdSchema),
    userController.activateAccount.bind(userController)
  );

  // ADMIN ONLY: Deactivate account
  router.patch(
    '/:id/deactivate',
    authMiddleware,
    roleGuard([ROLES.ADMIN]),
    validate(userIdSchema),
    userController.deactivateAccount.bind(userController)
  );

  return router;
};

export default userRoutes;
