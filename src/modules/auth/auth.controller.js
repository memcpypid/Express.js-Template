import ApiResponse from '../../common/api-response.js';

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);

      res.status(200).json(ApiResponse.success(result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json(ApiResponse.success(user, 'User registered successfully', 201));
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refresh_token } = req.body;
      const tokens = await this.authService.refresh_token(refresh_token);
      res.status(200).json(ApiResponse.success(tokens, 'Token refreshed successfully'));
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refresh_token } = req.body;
      await this.authService.logout(refresh_token);
      res.status(200).json(ApiResponse.success(null, 'Logout successful'));
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
