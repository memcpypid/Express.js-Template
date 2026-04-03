export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    LOGIN_FAILED: 'Invalid email or password',
    REGISTER_SUCCESS: 'Registration successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REFRESH_SUCCESS: 'Token refreshed successfully',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'You do not have permission to access this resource',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid token',
  },
  USER: {
    CREATED: 'User created successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
    NOT_FOUND: 'User not found',
    EMAIL_EXISTS: 'Email already exists',
  },
  DATABASE: {
    CONNECTED: 'Database connected successfully',
    CONNECTION_ERROR: 'Database connection error',
  },
  SERVER: {
    STARTED: 'Server started successfully',
    INTERNAL_ERROR: 'Internal server error',
  },
};

export default MESSAGES;
