import { emailStructure, transporter } from "../../../mailer.ts";
import { NextFunction, Request, Response } from "express";
import { parsePaginationParams } from "../../../utils.ts";
import { prisma } from "../../../database.ts";
import { type ReqWithResult, UpdateQuestionBody, CreateConversationBody, ListConversationBody } from "../../../types.ts";
import { validateCreateConversation, validateListConversation } from "./models.ts";

export const getAllConversations = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req;
  const { offset, limit } = parsePaginationParams(query);

  try {
    const response = await prisma.conversation.findMany({
      skip: offset,
      take: limit,
    })
    res.json(response).status(200)
  } catch (error) {
    next({ message: "Can't get all conversations", status: 400 })
  }
}

export const createConversation = async (req: Request, res: Response, next: NextFunction) => {
  const { body }: { body: CreateConversationBody } = req

  const validation = await validateCreateConversation(body)

  if (!validation.success) {
    return next({
      message: "Incorrect data provided",
      status: 400,
      error: validation.error
    })
  }

  const { userAId, userBId } = validation.data

  try {
    const conversation = await prisma.conversation.create({
      data: {
        userAId,
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

export const listMyConversations = async (req: Request, res: Response, next: NextFunction) => {
  const { body }: { body: ListConversationBody } = req

  const validation = await validateListConversation(body)

  if (!validation.success) {
    return next({
      message: "Incorrect data provided",
      status: 400,
      error: validation.error
    })
  }

  const { userId } = validation.data

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userAId: userId,
          },
          {
            userBId: userId,
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

    res.json(conversations);
  } catch (error) {
    next(error);
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

// export const updateQuestionById = async (req: ReqWithResult, res: Response, next: NextFunction) => {
//   const { result } = req;
//   const { body }: { body: UpdateQuestionBody } = req

//   if (!result) {
//     return next({ message: 'Invalid question', status: 400 })
//   }

//   const validation = await validateUpdateQuestion(body)

//   if (!validation.success) {
//     return next({
//       message: "Incorrect data provided",
//       status: 400,
//       error: validation.error
//     })
//   }

//   try {
//     const response = await prisma.questions.update({
//       where: {
//         id: result.id
//       },
//       data: {
//         ...validation.data
//       }
//     })

//     const { contactEmail, answer } = response

//     if (contactEmail && answer) {
//       const mail = emailStructure({ contactEmail, answer });
//       await transporter.sendMail(mail);
//     }

//     res.json(response).status(200)
//   } catch (error) {
//     next({ message: "Can't update the question", status: 400 })
//   }
// }

