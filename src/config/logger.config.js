import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, json } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, requestId }) => {
  return `${timestamp} ${level}: ${requestId ? `[${requestId}] ` : ''}${stack || message}`;
});

const transports = [
  new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    ),
  }),
];

if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({ 
      filename: 'src/logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'src/logs/warning.log', 
      level: 'warn' 
    }),
    new winston.transports.File({ 
      filename: 'src/logs/info.log', 
      level: 'info' 
    })
  );
}

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    process.env.NODE_ENV === 'production' ? json() : logFormat
  ),
  transports,
});

export default logger;
