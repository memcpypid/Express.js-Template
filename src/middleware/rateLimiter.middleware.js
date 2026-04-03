import { rateLimit } from 'express-rate-limit';
import ApiResponse from '../common/api-response.js';

/**
 * General API Rate Limiter
 */
export const generalRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: ApiResponse.error('Too many requests, please try again later', 429),
});

/**
 * Auth Specific Rate Limiter (Brute-force protection)
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: ApiResponse.error('Too many login/register attempts, please try again later', 429),
});
