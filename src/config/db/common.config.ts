import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export default function commonConfig(): DataSourceOptions {
  const devConfig = {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: null,
  };

  const prodConfig = {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: { rejectUnauthorized: false },
  };

  return {
    type: 'postgres',
    synchronize: true,
    entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
    ...(process.env.NODE_ENV === 'production' ? prodConfig : devConfig),
  };
}
