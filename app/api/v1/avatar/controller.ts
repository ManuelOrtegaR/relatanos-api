import { NextFunction, Request, Response } from "express";
import { parsePaginationParams } from "../../../utils.ts";
import { prisma } from "../../../database.ts";
import { type ReqWithResult, spriteTypes, AvatarData } from "../../../types.ts";
import { validateCreateCharacter, validateUpdateCharacter } from "./models.ts";

export const getAllSprites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.$transaction(async (transaction) => {
      const faces = await transaction.face.findMany()
      const hairs = await transaction.hair.findMany()
      const eyes = await transaction.eye.findMany()
      const mouths = await transaction.mouth.findMany()
      const noses = await transaction.nose.findMany()
      res.json({ faces, hairs, eyes, mouths, noses }).status(200)
    })
  } catch (error) {
    console.log(error)
    next({ message: "Can't get all sprites", status: 400 })
  }
}

export const getAvatarSprites = async (req: Request, res: Response, next: NextFunction) => {
  const { body }: { body: AvatarData } = req
  try {
    await prisma.$transaction(async (transaction) => {
      const faceUrl = await transaction.face.findUnique({
        where: {
          id: body.faceId
        }
      })
      const hairUrl = await transaction.hair.findUnique({
        where: {
          id: body.hairId
        }
      })
      const eyeUrl = await transaction.eye.findUnique({
        where: {
          id: body.eyeId
        }
      })
      const mouthUrl = await transaction.mouth.findUnique({
        where: {
          id: body.mouthId
        }
      })
      const noseUrl = await transaction.nose.findUnique({
        where: {
          id: body.noseId
        }
      })
      res.json({ faceUrl, hairUrl, eyeUrl, mouthUrl, noseUrl }).status(200)
    })
  } catch (error) {
    console.log(error)
    next({ message: "Can't get avatar's sprites", status: 400 })
  }
}

export const spriteId = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { params = {}, body = {} } = req;
  const spriteType = body.type as spriteTypes
  try {
    const { id } = params;

    if (spriteType === 'face') {
      const result = await prisma.face.findUnique({
        where: {
          id,
        },
      });
      if (result) {
        req.result = result;
      } else {
        next({ message: 'Invalid face sprite', status: 400 });
      }
      next();
    }

    if (spriteType === 'hair') {
      const result = await prisma.hair.findUnique({
        where: {
          id,
        },
      });
      if (result) {
        req.result = result;
      } else {
        next({ message: 'Invalid hair sprite', status: 400 });
      }
      next()
    }

    if (spriteType === 'eye') {
      const result = await prisma.eye.findUnique({
        where: {
          id,
        },
      });
      if (result) {
        req.result = result;
      } else {
        next({ message: 'Invalid eye sprite', status: 400 });
      }
      next()
    }

    if (spriteType === 'mouth') {
      const result = await prisma.mouth.findUnique({
        where: {
          id,
        },
      });
      if (result) {
        req.result = result;
      } else {
        next({ message: 'Invalid mouth sprite', status: 400 });
      }
      next()
    }

    if (spriteType === 'nose') {
      const result = await prisma.nose.findUnique({
        where: {
          id,
        },
      });
      if (result) {
        req.result = result;
      } else {
        next({ message: 'Invalid nose sprite', status: 400 });
      }
      next()
    }
  } catch (error) {
    next(error);
  }
}

export const getSpriteById = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { result, decoded } = req;

  if (!decoded) {
    return next({
      message: "Forbidden",
      status: 403,
    })
  }

  if (!result) {
    return next({ message: 'Invalid sprite', status: 400 })
  }

  res.json(result).status(200);
}
