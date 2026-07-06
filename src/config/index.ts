import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  db: {
    url: process.env.DATABASE_URL!,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
  },
  loki: {
    host: process.env.LOKI_HOST || 'http://localhost:3100',
  }
};
