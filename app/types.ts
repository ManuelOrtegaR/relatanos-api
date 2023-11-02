import { Request } from "express"

export type APIError = Error & { status: number, error: Error, message: string }

export type Configuration = {
  port: number,
  pagination: PaginationConfiguration,
}

export type PaginationConfiguration = {
  limit: number,
  offset: number
}

export type SignupBody = {
  nickname: string,
  email: string,
  birthdate: string,
  password: string
}

export type SignIn = {
  email: string,
  password: string
}

export type UpdateUserBody = {
  password?: string,
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

export type ReqWithResult = Request & { result?: Result }

export type CharacterData = {
  name: string,
  description: string,
  characteristics: string,
  nacionality: string
  genderId: string,
  age: string,
  languageId: string,
  userId: string
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
  userAId: string,
  userBId: string,
}

export type ListConversationBody = {
  userId: string,
}
