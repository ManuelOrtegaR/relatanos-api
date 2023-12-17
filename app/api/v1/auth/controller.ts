import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../database.ts";

import { SignIn, SignupBody } from '../../../types.ts';
import { validateSignin, validateSignup } from "./models.ts";
import { signToken } from "../auth.ts";


export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { body }: { body: SignupBody } = req
  console.log('entre aqui')

  const validation = await validateSignup(body)

  if (!validation.success) {
    return next({
      message: "Incorrect data provided",
      status: 400,
      error: validation.error
    })
  }

  try {
    await prisma.user.create({
      data: {
        ...validation.data,
        picture: "https://placehold.co/400",
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

  try {

    const response = await prisma.user.findUnique({
      where: {
        firebaseUid: validation.data.firebaseUid
      },
      include: {
        characters: true
      }
    })

    if (response === null) {
      return next({
        message: "Wrong email or password",
        status: 400,
      })
    }

    // const { emailVerify } = response

    // if (!emailVerify) {
    //   return next({
    //     message: "Need to verify your email account",
    //     status: 400
    //   })
    // }

    const { id, firebaseUid } = response

    const token = signToken({ id, firebaseUid })

    res.json({
      message: "Login successfully",
      data: { ...response },
      meta: {
        token
      }
    }).status(200)

  } catch (error) {
    console.log(error)
    next({
      message: "Wrong email or password",
      status: 400,
      error,
    })
  }
}
