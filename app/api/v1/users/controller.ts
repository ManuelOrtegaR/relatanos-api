import { NextFunction, Request, Response } from "express";
import { parsePaginationParams } from "../../../utils.ts";
import { prisma } from "../../../database.ts";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req;
  const { offset, limit } = parsePaginationParams(query);
  try {
    const response = await prisma.user.findMany({
      skip: offset,
      take: limit,
      include: {
        characters: true
      }
    })

    res.json(response).status(200)
  } catch (error) {
    console.log(error)
    next({ message: "Can't get all users", status: 400 })
  }
}

