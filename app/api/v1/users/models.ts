import { z } from 'zod';
import { UpdateUserBody } from '../../../types.ts';

const UpdateUserSchema = z.object({
  password: z.string().min(8).max(16).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/).optional(),
  picture: z.string().trim().optional(),
  suscription: z.boolean().optional(),
  coins: z.number().optional(),
  gems: z.number().optional(),
  notifications: z.boolean().optional(),
  status: z.string().trim().optional(),
});

export const validateUpdate = async (payload: UpdateUserBody) => {
  return UpdateUserSchema.spa(payload)
}

