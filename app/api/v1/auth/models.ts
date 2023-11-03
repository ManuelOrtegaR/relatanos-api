import { z } from 'zod';
import { SignIn, SignupBody } from '../../../types.ts';

const UserSchema = z.object({
  nickname: z.string().trim().toUpperCase(),
  email: z.string().trim().email().toUpperCase(),
  birthdate: z.string().trim(),
  firebaseUid: z.string().trim(),
});

const SignInSchema = z.object({
  firebaseUid: z.string().trim(),
});

export const validateSignup = async (payload: SignupBody) => {
  return UserSchema.spa(payload)
}

export const validateSignin = async (payload: SignIn) => {
  return SignInSchema.spa(payload)
}
