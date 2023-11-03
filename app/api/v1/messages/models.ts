import { z } from 'zod';
import { CreateMessageBody } from '../../../types.ts';

const MessageSchema = z.object({
  content: z.string().trim(),
  conversationId: z.string().trim().optional(),
  chatId: z.string().trim().optional(),
});


export const validateCreateMessage = async (payload: CreateMessageBody) => {
  return MessageSchema.spa(payload)
}

