import { Request } from "express"

export type APIError = Error & { status: number, error: Error, message: string }

export type Configuration = {
  port: number,
  pagination: PaginationConfiguration,
  token: TokenConfiguration
}

export type PaginationConfiguration = {
  limit: number,
  offset: number
}

export type TokenConfiguration = {
  secret: string,
  expires: string
}

export type SignInToken = {
  id: string,
  firebaseUid: string
}

export type SignupBody = {
  nickname: string,
  email: string,
  birthdate: string,
  FirebaseUid: string
}

export type SignIn = {
  firebseUid: string,
}

export type UpdateUserBody = {
  picture?: string,
  suscription?: boolean,
  coins?: number,
  gems?: number,
  notifications?: boolean,
  status?: string
}

type Result = {
  id?: string
}

export type ReqWithResult = Request & { result?: Result, decoded?: Record<string, string> }

export type CharacterData = {
  name: string,
  description: string,
  characteristics: string,
  nacionality: string
  genderId: string,
  age: string,
  languageId: string,
}

export type AvatarData = {
  faceId: string,
  eyeId: string,
  hairId: string,
  mouthId: string
}

export interface CreateCharacterBody {
  characterData: CharacterData,
  avatarData: AvatarData
}

export type UpdateCharacterBody = {
  name?: string,
  description?: string,
  characteristics?: string,
  nacionality?: string,
  age?: string,
  status?: string
}

export type CreateQuestionBody = {
  name: string,
  email: string,
  message: string
}

export type UpdateQuestionBody = {
  answer: string,
  questionStatus: boolean
}

export type EmailStructure = {
  contactEmail: string,
  answer: string,
}

export type CreateConversationBody = {
  userBId: string,
}

export type CreateMessageBody = {
  content: string,
  conversationId?: string,
  chatId?: string,
}

export type ListConversationBody = {
  userId: string,
}

export type CreateRoomBody = {
  characterId: string,
  turns: number,
  languageId: string,
  litGenreId: string,
  locationId: string,
}

export type UpdateRoomBody = {
  turns?: number,
  languageId?: string,
  litGenreId?: string,
  locationId?: string,
}

export type joinRoomType = {
  characterId: string
}
