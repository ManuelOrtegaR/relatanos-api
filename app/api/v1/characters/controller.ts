import { NextFunction, Request, Response } from "express";
import { parsePaginationParams } from "../../../utils.ts";
import { prisma } from "../../../database.ts";
import { type ReqWithResult, CreateCharacterBody, UpdateCharacterBody } from "../../../types.ts";
import { validateCreateCharacter, validateUpdateCharacter } from "./models.ts";

export const getAllCharacters = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req;
  const { offset, limit } = parsePaginationParams(query);

  try {
    const response = await prisma.character.findMany({
      skip: offset,
      take: limit,
      include: {
        avatar: true
      }
    })
    res.json(response).status(200)
  } catch (error) {
    next({ message: "Can't get all characters", status: 400 })
  }
}

export const createCharacter = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { body, decoded }: { body: CreateCharacterBody, decoded?: Record<string, string> } = req

  if (!decoded) {
    return next({
      message: "Forbidden",
      status: 403,
    })
  }

  const validation = await validateCreateCharacter(body)

  if (!validation.success) {
    return next({
      message: "Incorrect data provided",
      status: 400,
      error: validation.error
    })
  }

  const { id } = decoded
  const { characterData, avatarData } = validation.data

  const { genderId, languageId, ...rest } = characterData
  const { eyeId, faceId, hairId, mouthId } = avatarData

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.user.findUnique({
        where: {
          id,
        }
      })

      await transaction.language.findUnique({
        where: {
          id: languageId
        }
      })

      await transaction.gender.findUnique({
        where: {
          id: genderId
        }
      })

      const responseCharacter = await transaction.character.create({
        data: {
          userId: id,
          genderId,
          languageId,
          status: "active",
          ...rest
        }
      })

      const { id: characterId } = responseCharacter

      await transaction.face.findUnique({
        where: {
          id: faceId
        }
      })

      await transaction.eye.findUnique({
        where: {
          id: eyeId
        }
      })

      await transaction.hair.findUnique({
        where: {
          id: hairId
        }
      })

      await transaction.mouth.findUnique({
        where: {
          id: mouthId
        }
      })

      const responseAvatar = await transaction.avatar.create({
        data: {
          characterId,
          faceId,
          eyeId,
          hairId,
          mouthId,
        }
      })

      res.json({ character: responseCharacter, avatar: responseAvatar }).status(200)
    })
  } catch (error) {
    next({ message: "Can't create character", status: 400, error })
  }
}

export const getAllCharactersByUser = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { decoded } = req

  if (!decoded) {
    return next({
      message: "Forbidden",
      status: 403,
    })
  }

  const { id } = decoded

  try {
    const response = await prisma.character.findMany({
      where: {
        userId: id
      },
      include: {
        avatar: true
      }
    })

    if (response.length === 0) {
      return next({
        message: "Empty characters or invalid user",
        status: 400,
      })
    }

    res.json(response).status(200)
  } catch (error) {
    next({
      message: "Can't get characters",
      status: 400,
    })
  }
}

export const characterId = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { params = {} } = req;
  try {
    const { id } = params;
    const result = await prisma.character.findUnique({
      where: {
        id,
      },
    });

    if (result) {
      req.result = result;
    } else {
      next({ message: 'Invalid character', status: 400 });
    }
    next();
  } catch (error) {
    next(error);
  }
}

export const getCharacterById = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { result } = req;

  if (!result) {
    return next({ message: 'Invalid character', status: 400 })
  }

  try {
    const character = await prisma.character.findUnique({
      where: {
        id: result.id,
      },
      include: {
        avatar: true
      },
    });

    res.json({ ...character }).status(200);
  } catch (error) {
    next({ message: "Can't get the character", status: 400 });
  }
}

export const updateCharacterById = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { result } = req;
  const { body }: { body: UpdateCharacterBody } = req

  if (!result) {
    return next({ message: 'Invalid character', status: 400 })
  }

  const validation = await validateUpdateCharacter(body)

  if (!validation.success) {
    return next({
      message: "Incorrect data provided",
      status: 400,
      error: validation.error
    })
  }

  try {
    const response = await prisma.character.update({
      where: {
        id: result.id
      },
      data: {
        ...validation.data
      }
    })

    res.json(response).status(200)
  } catch (error) {
    next({ message: "Can't update the character", status: 400 })
  }
}

export const activateCharacterById = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { result } = req;

  if (!result) {
    return next({ message: 'Invalid character', status: 400 })
  }

  try {
    const response = await prisma.character.update({
      where: {
        id: result.id
      },
      data: {
        status: "active"
      }
    })

    res.json(response).status(200)
  } catch (error) {
    next({ message: "Can't activate the character", status: 400 })
  }
}
