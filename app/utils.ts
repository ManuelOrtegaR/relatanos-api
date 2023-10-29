import { hash, compare } from 'bcrypt';

export const encryptPassword = (password: string) => {
  return hash(password, 10);
};

export const verifyPassword = (password: string, encryptPassword: string) => {
  return compare(password, encryptPassword);
};
