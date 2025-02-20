import dotenv from 'dotenv';
import type { StringValue } from 'ms';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as StringValue,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN as StringValue,
};

export default config;
