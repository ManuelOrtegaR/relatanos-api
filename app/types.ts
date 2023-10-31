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

