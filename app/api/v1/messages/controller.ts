import { NextFunction, Request, Response } from "express";
import { prisma } from "../../../database.ts";
import { type ReqWithResult, CreateMessageBody } from "../../../types.ts";
import { validateCreateMessage } from "./models.ts";

export const createMessage = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { body, decoded }: { body: CreateMessageBody, decoded?: Record<string, string> } = req;

  const validation = await validateCreateMessage(body)

  if (!validation.success) {
    return next({
      message: "Incorrect data provided",
      status: 400,
      error: validation.error
    })
  }

  if (!decoded) {
    return next({
      message: "Forbidden",
      status: 403,
    })
  }

  const conversationId = body.conversationId ? body.conversationId : null;
  const chatId = body.chatId ? body.chatId : null;
  const { content } = body
  const { id } = decoded;

  if (conversationId) {
    try {
      const message = await prisma.message.create({
        data: {
          content,
          conversationId,
          userId: id
        },
      });

      res.json(message).status(200);
    } catch (error) {
      next({
        message: "Can't create message",
        status: 400,
        error,
      })
    }
  }

  if (chatId) {
    try {
      const message = await prisma.message.create({
        data: {
          content,
          chatId,
          userId: id
        },
      });

      res.json(message).status(200);
    } catch (error) {
      next({
        message: "Can't create message",
        status: 400,
        error,
      })
    }
  }
}


