import { z } from 'zod';
import { SignIn, SignupBody } from '../../../types.ts';

const UserSchema = z.object({
  nickname: z.string().trim().toUpperCase(),
  email: z.string().trim().email().toUpperCase(),
  birthdate: z.string().trim(),
  password: z.string().min(8).max(16).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/)
});

const SignInSchema = z.object({
  email: z.string().trim().email().toUpperCase(),
  password: z.string().min(8).max(16).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/)
});

export const validateSignup = async (payload: SignupBody) => {
  return UserSchema.spa(payload)
}

export const validateSignin = async (payload: SignIn) => {
  return SignInSchema.spa(payload)
}
