import { z } from 'zod';
import { CreateConversationBody, ListConversationBody } from '../../../types.ts';

const ConversationSchema = z.object({
  userBId: z.string().trim(),
});

const ListSchema = z.object({
  userId: z.string().trim(),
});

export const validateCreateConversation = async (payload: CreateConversationBody) => {
  return ConversationSchema.spa(payload)
}
export const validateListConversation = async (payload: ListConversationBody) => {
  return ListSchema.spa(payload)
}

