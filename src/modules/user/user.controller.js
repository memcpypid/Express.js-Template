import ApiResponse from '../../common/api-response.js';
import { generatePagination } from '../../common/utils/pagination.js';

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async getAllUsers(req, res, next) {
    try {
      const paginationParams = generatePagination(req.query);

      const { users, total, limit, page, ...additionalMeta } =
        await this.userService.getAllUsers(paginationParams);

      res.status(200).json(
        ApiResponse.pagination(
          users,
          'Users retrieved successfully',
          total,
          limit,
          page,
          additionalMeta
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.status(200).json(ApiResponse.success(user));
    } catch (error) {
      next(error);
    }
  }

  async updateOwnProfile(req, res, next) {
    try {
      const user = await this.userService.updateUser(req.user.id, req.body);
      res.status(200).json(ApiResponse.success(user, 'Profile updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      res.status(200).json(ApiResponse.success(user, 'User updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getOwnProfile(req, res, next) {
    try {
      const user = await this.userService.getUserById(req.user.id);
      res.status(200).json(ApiResponse.success(user));
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(ApiResponse.success(user, 'User created successfully', 201));
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(200).json(ApiResponse.success(null, 'User deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  async activateAccount(req, res, next) {
    try {
      const user = await this.userService.activateAccount(req.params.id);
      res.status(200).json(ApiResponse.success(user, 'Account activated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async deactivateAccount(req, res, next) {
    try {
      const user = await this.userService.deactivateAccount(req.params.id);
      res.status(200).json(ApiResponse.success(user, 'Account deactivated successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
