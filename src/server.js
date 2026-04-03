import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import logger from './config/logger.config.js';
import { connectDB } from './database/index.js';
import sequelize from './database/index.js';

dotenv.config();

const port = process.env.PORT || 3000;
const server = http.createServer(app);

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Start HTTP Server
    server.listen(port, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
      logger.info(`API Endpoint: http://localhost:${port}/api/v1`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

/**
 * Handle Graceful Shutdown
 */
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  
  server.close(async () => {
    logger.info('HTTP server closed.');
    
    try {
      await sequelize.close();
      logger.info('Database connection closed.');
      process.exit(0);
    } catch (err) {
      logger.error('Error closing database connection:', err);
      process.exit(1);
    }
  });

  // Force shutdown if it takes too long
  setTimeout(() => {
    logger.error('Forcefully shutting down after timeout.');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  gracefulShutdown('Uncaught Exception');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('Unhandled Rejection');
});

startServer();
