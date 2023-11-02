import { emailStructure, transporter } from "../../../mailer.ts";
import { NextFunction, Request, Response } from "express";
import { parsePaginationParams } from "../../../utils.ts";
import { prisma } from "../../../database.ts";
import { type ReqWithResult, CreateQuestionBody, UpdateQuestionBody } from "../../../types.ts";
import { validateCreateQuestion, validateUpdateQuestion } from "./models.ts";

export const getAllQuestions = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req;
  const { offset, limit } = parsePaginationParams(query);

  try {
    const response = await prisma.questions.findMany({
      skip: offset,
      take: limit,
    })
    res.json(response).status(200)
  } catch (error) {
    next({ message: "Can't get all questions", status: 400 })
  }
}

export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  const { body }: { body: CreateQuestionBody } = req

  const validation = await validateCreateQuestion(body)

  if (!validation.success) {
    return next({
      message: "Incorrect data provided",
      status: 400,
      error: validation.error
    })
  }

  const { email, message, name } = validation.data

  try {
    await prisma.questions.create({
      data: {
        contactEmail: email,
        contactName: name,
        message,
        questionStatus: false,
      }
    })
    res.json({ message: "Succesfully created" }).status(200)
  } catch (error) {
    next({
      message: "Can't create question",
      status: 400,
      error,
    })
  }
}

export const questionId = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { params = {} } = req;
  try {
    const { id } = params;
    const result = await prisma.questions.findUnique({
      where: {
        id,
      },
    });

    if (result) {
      req.result = result;
    } else {
      next({ message: 'Invalid question', status: 400 });
    }
    next();
  } catch (error) {
    next(error);
  }
}

export const getQuestionById = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { result } = req;

  if (!result) {
    return next({ message: 'Invalid question', status: 400 })
  }

  try {
    const question = await prisma.questions.findUnique({
      where: {
        id: result.id,
      },
    });

    res.json({ ...question }).status(200);
  } catch (error) {
    next({ message: "Can't get the question", status: 400 });
  }
}

export const updateQuestionById = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { result } = req;
  const { body }: { body: UpdateQuestionBody } = req

  if (!result) {
    return next({ message: 'Invalid question', status: 400 })
  }

  const validation = await validateUpdateQuestion(body)

  if (!validation.success) {
    return next({
      message: "Incorrect data provided",
      status: 400,
      error: validation.error
    })
  }

  try {
    const response = await prisma.questions.update({
      where: {
        id: result.id
      },
      data: {
        ...validation.data
      }
    })

    const { contactEmail, answer } = response

    if (contactEmail && answer) {
      const mail = emailStructure({ contactEmail, answer });
      await transporter.sendMail(mail);
    }

    res.json(response).status(200)
  } catch (error) {
    next({ message: "Can't update the question", status: 400 })
  }
}

