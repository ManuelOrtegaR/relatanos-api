import { emailStructure, transporter } from "../../../mailer.ts";
import { NextFunction, Request, Response } from "express";
import { parsePaginationParams } from "../../../utils.ts";
import { prisma } from "../../../database.ts";
import { type ReqWithResult, CreateConversationBody } from "../../../types.ts";
import { validateCreateConversation } from "./models.ts";

export const getAllChats = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { query, decoded } = req;
  const { offset, limit } = parsePaginationParams(query);

  if (!decoded) {
    return next({ message: "Forbidden", status: 403 })
  }

  const { id } = decoded

  try {
    const chats = await prisma.chat.findMany({
      skip: offset,
      take: limit,
      where: {
        OR: [
          {
            userAId: id,
          },
          {
            userBId: id,
          },
          {
            userCId: id,
          },
          {
            userDId: id,
          }
        ],
      },
      include: {
        userA: {
          select: {
            id: true,
            nickname: true,
            email: true,
          },
        },
        userB: {
          select: {
            id: true,
            nickname: true,
            email: true,
          },
        },
        userC: {
          select: {
            id: true,
            nickname: true,
            email: true,
          },
        },
        userD: {
          select: {
            id: true,
            nickname: true,
            email: true,
          },
        },
      },
    });

    res.json(chats).status(200);
  } catch (error) {
    next({ message: "Can't get all chats", status: 400 })
  }
}

export const chatId = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { params = {} } = req;
  try {
    const { id } = params;
    const result = await prisma.chat.findUnique({
      where: {
        id,
      },
    });

    if (result) {
      req.result = result;
    } else {
      next({ message: 'Invalid chat', status: 400 });
    }
    next();
  } catch (error) {
    next(error);
  }
}

export const getChatById = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { result } = req;

  if (!result) {
    return next({ message: 'Invalid chat', status: 400 })
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: result.id,
      },
      include: {
        messages: true
      }
    });

    res.json(chat).status(200);
  } catch (error) {
    next({ message: "Can't get the chat", status: 400 });
  }
}


