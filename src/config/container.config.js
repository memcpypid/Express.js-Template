import { createContainer, asClass, asValue, InjectionMode } from 'awilix';
import logger from './logger.config.js';
import sequelize from '../database/index.js';

// Repositories
import UserRepository from '../modules/user/user.repository.js';

// Services
import UserService from '../modules/user/user.service.js';
import AuthService from '../modules/auth/auth.service.js';

// Controllers
import UserController from '../modules/user/user.controller.js';
import AuthController from '../modules/auth/auth.controller.js';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

/**
 * Register all dependencies into the DI container
 */
export const configureContainer = () => {
  container.register({
    // Core
    logger: asValue(logger),
    db: asValue(sequelize),
    
    // Repositories
    userRepository: asClass(UserRepository).singleton(),
    
    // Services
    userService: asClass(UserService).singleton(),
    authService: asClass(AuthService).singleton(),

    // Controllers
    userController: asClass(UserController).singleton(),
    authController: asClass(AuthController).singleton(),
  });

  return container;
};

export default container;
