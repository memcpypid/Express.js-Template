import { Op } from 'sequelize';
import UserDTO from './user.dto.js';
import bcrypt from 'bcryptjs';
import { BadRequestError, NotFoundError } from '../../common/app-error.js';

class UserService {
  constructor(userRepository, logger) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

  async getAllUsers(options) {
    this.logger.info('Service: getAllUsers called');
    const {
      page = 1,
      limit = 10,
      offset = 0,
      sort = 'desc',
      sortBy = 'created_at',
      search = '',
    } = options;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await this.userRepository.model.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sort.toUpperCase()]],
    });

    return {
      users: UserDTO.fromUsers(rows),
      total: count,
      page,
      limit,
      sort,
      sort_by: sortBy,
      search,
    };
  }
  async countUser() {
    this.logger.info('Service: countUser called');
    const counts = await this.userRepository.count();
    if (counts == 0) throw new NotFoundError('User not found');
    return UserDTO.countUser(counts);
  }
  async getUserById(id) {
    this.logger.info('Service: getUserById called');
    const user = await this.userRepository.findByPk(id);
    if (!user) throw new NotFoundError('User not found');
    return UserDTO.fromUser(user);
  }

  async createUser(data) {
    this.logger.info('Service: createUser called');
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) throw new BadRequestError('Email already registered');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({ ...data, password: hashedPassword });
    return UserDTO.fromUser(user);
  }

  async updateUser(id, data) {
    this.logger.info('Service: updateUser called');
    const user = await this.userRepository.findByPk(id);
    if (!user) throw new NotFoundError('User not found');

    // Proactive check for email uniqueness if email is being changed
    if (data.email && data.email !== user.email) {
      const conflictUser = await this.userRepository.findByEmail(data.email);
      if (conflictUser) {
        throw new BadRequestError('Email already in use by another account');
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await user.update(data);
    return UserDTO.fromUser(updatedUser);
  }

  async deleteUser(id) {
    this.logger.info('Service: deleteUser called');
    const user = await this.userRepository.findByPk(id);
    if (!user) throw new NotFoundError('User not found');
    return await user.destroy();
  }

  async activateAccount(id) {
    this.logger.info('Service: activateAccount called');
    const user = await this.userRepository.findByPk(id);
    if (!user) throw new NotFoundError('User not found');

    if (user.is_verified) {
      throw new BadRequestError('Account is already active/verified');
    }

    const updatedUser = await user.update({ is_verified: true });
    return UserDTO.fromUser(updatedUser);
  }

  async deactivateAccount(id) {
    this.logger.info('Service: deactivateAccount called');
    const user = await this.userRepository.findByPk(id);
    if (!user) throw new NotFoundError('User not found');

    if (!user.is_verified) {
      throw new BadRequestError('Account is already inactive/not verified');
    }

    const updatedUser = await user.update({ is_verified: false });
    return UserDTO.fromUser(updatedUser);
  }
}

export default UserService;
