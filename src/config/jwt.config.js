import dotenv from 'dotenv';
dotenv.config();

export default {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'fallback-access-secret-32-chars-at-least',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-32-chars-at-least',
  accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
  refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
};
