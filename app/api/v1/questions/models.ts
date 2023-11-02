import { z } from 'zod';
import { CreateQuestionBody, UpdateQuestionBody } from '../../../types.ts';

const QuestionSchema = z.object({
  name: z.string().trim().toUpperCase(),
  email: z.string().trim().email().toUpperCase(),
  message: z.string().trim(),
});

const QuestionUpdateSchema = z.object({
  answer: z.string().trim(),
  questionStatus: z.boolean(),
});

export const validateCreateQuestion = async (payload: CreateQuestionBody) => {
  return QuestionSchema.spa(payload)
}
export const validateUpdateQuestion = async (payload: UpdateQuestionBody) => {
  return QuestionUpdateSchema.spa(payload)
}

