import { z } from 'zod';
import { CreateCharacterBody, UpdateCharacterBody } from '../../../types.ts';

const CharacterSchema = z.object({
  name: z.string().trim(),
  description: z.string().trim(),
  characteristics: z.string().trim(),
  nacionality: z.string().trim(),
  age: z.string().trim(),
  genderId: z.string().trim(),
  languageId: z.string().trim(),
})

const AvatarSchema = z.object({
  faceId: z.string().trim(),
  eyeId: z.string().trim(),
  hairId: z.string().trim(),
  mouthId: z.string().trim()
})

const CreateCharacterSchema = z.object({
  characterData: CharacterSchema,
  avatarData: AvatarSchema
});

const UpdateCharacterSchema = z.object({
  name: z.string().trim().optional(),
  description: z.string().trim().optional(),
  characteristics: z.string().trim().optional(),
  nacionality: z.string().trim().optional(),
  age: z.string().trim().optional(),
  status: z.string().trim().optional(),
})

export const validateCreateCharacter = async (payload: CreateCharacterBody) => {
  return CreateCharacterSchema.spa(payload)
}

export const validateUpdateCharacter = async (payload: UpdateCharacterBody) => {
  return UpdateCharacterSchema.spa(payload)
}

