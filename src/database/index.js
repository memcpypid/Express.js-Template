import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database.config.js';
import logger from '../config/logger.config.js';

const env = process.env.NODE_ENV || 'development';
const config = databaseConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging ? (msg) => logger.debug(msg) : false,
    pool: config.pool,
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info(`Database connected: ${config.dialect} on ${config.host}`);
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;
