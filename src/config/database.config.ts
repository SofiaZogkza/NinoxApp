import { registerAs } from '@nestjs/config';

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export default registerAs('database', (): DatabaseConfig => {
  const port = parseInt(process.env.DB_PORT || '5432', 10);
  if (isNaN(port)) {
    throw new Error('DB_PORT must be a valid number');
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'ninox_queue',
  };
});