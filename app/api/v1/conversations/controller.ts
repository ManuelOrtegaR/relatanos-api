import { emailStructure, transporter } from "../../../mailer.ts";
import { NextFunction, Request, Response } from "express";
import { parsePaginationParams } from "../../../utils.ts";
import { prisma } from "../../../database.ts";
import { type ReqWithResult, CreateConversationBody } from "../../../types.ts";
import { validateCreateConversation } from "./models.ts";

export const getAllConversations = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { query, decoded } = req;
  const { offset, limit } = parsePaginationParams(query);

  if (!decoded) {
    return next({ message: "Forbidden", status: 403 })
  }

  const { id } = decoded

  try {
    const conversations = await prisma.conversation.findMany({
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
      },
    });

    res.json(conversations).status(200);
  } catch (error) {
    next({ message: "Can't get all conversations", status: 400 })
  }
}

export const createConversation = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { body, decoded }: { body: CreateConversationBody, decoded?: Record<string, string> } = req

  const validation = await validateCreateConversation(body)

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
  const { id } = decoded
  const { userBId } = validation.data

  try {
    const conversation = await prisma.conversation.create({
      data: {
        userAId: id,
        userBId
      }
    })
    res.json(conversation).status(200)
  } catch (error) {
    next({
      message: "Can't create conversation",
      status: 400,
      error,
    })
  }
}

export const conversationId = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { params = {} } = req;
  try {
    const { id } = params;
    const result = await prisma.conversation.findUnique({
      where: {
        id,
      },
    });

    if (result) {
      req.result = result;
    } else {
      next({ message: 'Invalid conversation', status: 400 });
    }
    next();
  } catch (error) {
    next(error);
  }
}

export const getConversationById = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { result } = req;

  if (!result) {
    return next({ message: 'Invalid conversation', status: 400 })
  }

  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: result.id,
      },
    });

    res.json(conversation).status(200);
  } catch (error) {
    next({ message: "Can't get the conversation", status: 400 });
  }
}


