import * as dotenv from 'dotenv';
import { type Configuration } from './types.ts';
dotenv.config();

export const config: Configuration = {
  port: Number(process.env.PORT) || 3000,
  pagination: {
    limit: 10,
    offset: 0,
  },
};
