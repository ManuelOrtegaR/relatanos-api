import { hash, compare } from 'bcrypt';
import { config } from './config.ts';

const { pagination } = config;

export const parsePaginationParams = ({
  limit = pagination.limit,
  offset = pagination.offset,
}) => ({
  limit: typeof limit === 'string' && !Number.isNaN(Number.parseInt(limit)) ? Number.parseInt(limit) : pagination.limit,
  offset: typeof offset === 'string' && !Number.isNaN(Number.parseInt(offset)) ? Number.parseInt(offset) : pagination.offset,
});

export const encryptPassword = (password: string) => {
  return hash(password, 10);
};

export const verifyPassword = (password: string, encryptPassword: string) => {
  return compare(password, encryptPassword);
};
