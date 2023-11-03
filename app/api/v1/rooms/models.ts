import { z } from 'zod';
import { CreateRoomBody, UpdateRoomBody, joinRoomType } from '../../../types.ts';

const RoomSchema = z.object({
  characterId: z.string().trim(),
  turns: z.number(),
  languageId: z.string().trim(),
  litGenreId: z.string().trim(),
  locationId: z.string().trim(),
})


const UpdateRoomSchema = z.object({
  turns: z.number().optional(),
  languageId: z.string().trim().optional(),
  litGenreId: z.string().trim().optional(),
  locationId: z.string().trim().optional(),
})

const JoinRoomSchema = z.object({
  characterId: z.string().trim(),
})

export const validateCreateRoom = async (payload: CreateRoomBody) => {
  return RoomSchema.spa(payload)
}

export const validateUpdateRoom = async (payload: UpdateRoomBody) => {
  return UpdateRoomSchema.spa(payload)
}
export const validateJoinRoom = async (payload: joinRoomType) => {
  return JoinRoomSchema.spa(payload)
}

