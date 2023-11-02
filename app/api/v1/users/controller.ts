import { NextFunction, Request, Response } from "express";
import { parsePaginationParams } from "../../../utils.ts";
import { prisma } from "../../../database.ts";
import { UpdateUserBody, type ReqWithResult } from "../../../types.ts";
import { validateUpdate } from "./models.ts";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req;
  const { offset, limit } = parsePaginationParams(query);

  try {
    const response = await prisma.user.findMany({
      skip: offset,
      take: limit,
    })
    res.json(response).status(200)
  } catch (error) {
    next({ message: "Can't get all users", status: 400 })
  }
}

export const userId = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { params = {} } = req;
  try {
    const { id } = params;
    const result = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (result) {
      req.result = result;
    } else {
      next({ message: 'Invalid user', status: 400 });
    }
    next();
  } catch (error) {
    next(error);
  }
}

export const getUserById = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { result } = req;

  if (!result) {
    return next({ message: 'Invalid user', status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: result.id,
      },
      include: {
        characters: true
      },
    });

    res.json({ ...user, password: undefined }).status(200);
  } catch (error) {
    next({ message: "Can't get the user", status: 400 });
  }
}

export const updateUserById = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { result } = req;
  const { body }: { body: UpdateUserBody } = req

  if (!result) {
    return next({ message: 'Invalid user', status: 400 })
  }

  const validation = await validateUpdate(body)

  if (!validation.success) {
    return next({
      message: "Incorrect data provided",
      status: 400,
      error: validation.error
    })
  }

  try {
    const response = await prisma.user.update({
      where: {
        id: result.id
      },
      data: {
        ...validation.data
      }
    })

    res.json(response).status(200)
  } catch (error) {
    next({ message: "Can't update the user", status: 400 })
  }
}

export const activateUserById = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { result } = req;

  if (!result) {
    return next({ message: 'Invalid user', status: 400 })
  }

  try {
    const response = await prisma.user.update({
      where: {
        id: result.id
      },
      data: {
        status: "active"
      }
    })

    res.json(response).status(200)
  } catch (error) {
    next({ message: "Can't activate the user", status: 400 })
  }
}
