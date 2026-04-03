import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../../config/jwt.config.js';
import { UnauthorizedError, BadRequestError } from '../../common/app-error.js';
import RefreshToken from './refresh-token.model.js';
import UserDTO from '../user/user.dto.js';

class AuthService {
  constructor(userRepository, logger) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

  async login(email, password) {
    this.logger.info('Service: login called');
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.is_verified) {
      throw new UnauthorizedError('Your account is unverified');
    }

    const { access_token, refresh_token } = this.generateTokens(user);

    // Save refresh token to DB
    await RefreshToken.create({
      token: refresh_token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return { 
      user: UserDTO.fromUser(user), 
      access_token, 
      refresh_token 
    };
  }

  async register(userData) {
    this.logger.info('Service: register called');
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

  async refresh_token(token) {
    this.logger.info('Service: refresh_token called');
    const storedToken = await RefreshToken.findOne({ where: { token, revokedAt: null } });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await this.userRepository.findByPk(storedToken.userId);
    if (!user || !user.is_verified) {
      throw new UnauthorizedError('User not found or unverified');
    }

    const tokens = this.generateTokens(user);

    // Revoke old token and save new one (or just update)
    storedToken.revokedAt = new Date();
    await storedToken.save();

    await RefreshToken.create({
      token: tokens.refresh_token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return tokens;
  }

  async logout(token) {
    this.logger.info('Service: logout called');
    const storedToken = await RefreshToken.findOne({ where: { token } });
    if (storedToken) {
      storedToken.revokedAt = new Date();
      await storedToken.save();
    }
  }

  generateTokens(user) {
    const access_token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.accessSecret,
      { expiresIn: config.accessExpiry }
    );

    const refresh_token = jwt.sign({ id: user.id }, config.refreshSecret, {
      expiresIn: config.refreshExpiry,
    });

    return { access_token, refresh_token };
  }
}

export default AuthService;
