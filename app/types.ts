export type APIError = Error & { status: number, error: Error, message: string }

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

