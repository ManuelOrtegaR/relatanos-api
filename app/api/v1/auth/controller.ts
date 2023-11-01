import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../database.ts";

import { encryptPassword, verifyPassword } from "../../../utils.ts";
import { SignIn, SignupBody } from '../../../types.ts';
import { validateSignin, validateSignup } from "./models.ts";


export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { body }: { body: SignupBody } = req

  const validation = await validateSignup(body)

  if (!validation.success) {
    return next({
      message: "Incorrect data provided",
      status: 400,
      error: validation.error
    })
  }

  const { nickname, email, password, birthdate } = validation.data
  const encryptedPassword = await encryptPassword(password)

  try {
    await prisma.user.create({
      data: {
        nickname,
        email,
        password: encryptedPassword,
        picture: "https://placehold.co/400",
        birthdate,
        emailVerify: false,
        suscription: false,
        coins: 100,
        gems: 0,
        notifications: true,
        status: "Active"
      }
    })

    res.status(201).json({ message: "User created successfully" })

  } catch (error) {
    next({
      message: "Can't create user",
      status: 400,
      error,
    })
  }
}

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  const { body }: { body: SignIn } = req

  const validation = await validateSignin(body)

  if (!validation.success) {
    return next({
      message: "Wrong email or password",
      status: 400,
      error: validation.error
    })
  }

  const { email, password } = validation.data

  try {

    const response = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (response === null) {
      return next({
        message: "Wrong email or password",
        status: 400,
      })
    }

    const { emailVerify, password: encryptedPassword, id } = response
    const validatePassword = await verifyPassword(password, encryptedPassword)

    if (!emailVerify) {
      return next({
        message: "Need to verify your email account",
        status: 400
      })
    }

    if (!validatePassword) {
      return next({
        message: "Wrong email or password",
        status: 400
      })
    }

    res.json({
      message: "Login successfully"
    }).status(200)

  } catch (error) {
    next({
      message: "Wrong email or password",
      status: 400,
      error,
    })
  }
}
