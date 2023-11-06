import { NextFunction, Request, Response } from "express";
import { parsePaginationParams } from "../../../utils.ts";
import { prisma } from "../../../database.ts";
import { type ReqWithResult, CreateRoomBody, UpdateRoomBody, joinRoomType } from "../../../types.ts";
import { validateCreateRoom, validateJoinRoom, validateUpdateRoom } from "./models.ts";

export const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req;
  const { offset, limit } = parsePaginationParams(query);

  try {
    const response = await prisma.room.findMany({
      skip: offset,
      take: limit,
      where: {
        status: true,
      },
      include: {
        charactersInRoom: true,
        language: true,
        chat: true,
        litGenre: true,
        location: true,
      }
    })
    res.json(response).status(200)
  } catch (error) {
    next({ message: "Can't get all rooms", status: 400 })
  }
}

export const createRoom = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { body, decoded }: { body: CreateRoomBody, decoded?: Record<string, string> } = req

  if (!decoded) {
    return next({
      message: "Forbidden",
      status: 403,
    })
  }

  const validation = await validateCreateRoom(body)


  if (!validation.success) {
    return next({
      message: "Incorrect data provided",
      status: 400,
      error: validation.error
    })
  }

  const { id } = decoded
  const { characterId, ...rest } = validation.data

  try {
    await prisma.$transaction(async (transaction) => {
      const room = await transaction.room.create({
        data: {
          ...rest,
          status: true,
        }
      })

      const { id: roomId } = room

      const characterInRoom = await transaction.charactersInRoom.create({
        data: {
          roomId,
          characterId
        }
      })

      const chat = await transaction.chat.create({
        data: {
          userAId: id,
          roomId,
        }
      })

      res.json({ room, characterInRoom, chat }).status(200)
    })
  } catch (error) {
    console.log(error)
    next({
      message: "Can't create room",
      status: 400,
    })
  }
}

export const roomId = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { params = {} } = req;
  try {
    const { id } = params;
    const result = await prisma.room.findUnique({
      where: {
        id,
      },
    });

    if (result) {
      req.result = result;
    } else {
      next({ message: 'Invalid room', status: 400 });
    }
    next();
  } catch (error) {
    next(error);
  }
}

export const getRoomById = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { result } = req;

  if (!result) {
    return next({ message: 'Invalid room', status: 400 })
  }

  try {
    const room = await prisma.room.findUnique({
      where: {
        id: result.id,
      },
      include: {
        charactersInRoom: true,
        language: true,
        chat: true,
        litGenre: true,
        location: true,
      },
    });

    res.json({ ...room }).status(200);
  } catch (error) {
    next({ message: "Can't get the character", status: 400 });
  }
}

export const updateRoomById = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { result } = req;
  const { body }: { body: UpdateRoomBody } = req

  if (!result) {
    return next({ message: 'Invalid room', status: 400 })
  }

  const validation = await validateUpdateRoom(body)

  if (!validation.success) {
    return next({
      message: "Incorrect data provided",
      status: 400,
      error: validation.error
    })
  }

  try {
    const response = await prisma.room.update({
      where: {
        id: result.id
      },
      data: {
        ...validation.data
      }
    })

    res.json(response).status(200)
  } catch (error) {
    next({ message: "Can't update the room", status: 400 })
  }
}

export const joinRoom = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { result } = req;
  const { body, decoded }: { body: joinRoomType, decoded?: Record<string, string> } = req

  const validation = await validateJoinRoom(body)

  if (!validation.success) {
    return next({
      message: "Incorrect data provided",
      status: 400,
      error: validation.error
    })
  }

  if (!result) {
    return next({ message: 'Invalid room', status: 400 })
  }

  if (!decoded) {
    return next({
      message: "Forbidden",
      status: 403,
    })
  }

  const { id } = decoded
  const { characterId } = body

  try {
    await prisma.$transaction(async (transaction) => {
      const targetRoom = await transaction.room.findUnique({
        where: {
          id: result.id
        },
        include: {
          charactersInRoom: true,
          chat: true
        }
      })

      if (!targetRoom) {
        return next({ message: 'Invalid room', status: 400 })
      }

      const { charactersInRoom, chat, id: roomId } = targetRoom

      if (charactersInRoom.length >= 4) {
        return next({ message: 'The room is full', status: 400 })
      }

      if (charactersInRoom.length <= 3) {
        if (!chat?.userBId) {
          await transaction.chat.update({
            where: {
              roomId,
            },
            data: {
              userBId: id,
            }
          })
        } else if (!chat?.userCId) {
          await transaction.chat.update({
            where: {
              roomId,
            },
            data: {
              userCId: id,
            }
          })
        } else {
          await transaction.chat.update({
            where: {
              roomId,
            },
            data: {
              userDId: id,
            }
          })
        }
      }

      await transaction.charactersInRoom.create({
        data: {
          roomId,
          characterId: characterId
        }
      })

      res.json({ message: "You entered the room" }).status(200)
    })
  } catch (error) {
    return next({ message: "Can't join to the room", status: 400 })
  }
}

export const exitRoom = async (req: ReqWithResult, res: Response, next: NextFunction) => {
  const { result } = req;
  const { body, decoded }: { body: joinRoomType, decoded?: Record<string, string> } = req

  const validation = await validateJoinRoom(body)

  if (!validation.success) {
    return next({
      message: "Incorrect data provided",
      status: 400,
      error: validation.error
    })
  }

  if (!result) {
    return next({ message: 'Invalid room', status: 400 })
  }

  if (!decoded) {
    return next({
      message: "Forbidden",
      status: 403,
    })
  }

  const { id } = decoded
  const { characterId } = body

  try {
    await prisma.$transaction(async (transaction) => {
      const targetRoom = await transaction.room.findUnique({
        where: {
          id: result.id
        },
        include: {
          charactersInRoom: true,
          chat: true
        }
      })

      if (!targetRoom) {
        return next({ message: 'Invalid room', status: 400 })
      }

      const { charactersInRoom, chat, id: roomId } = targetRoom

      if (charactersInRoom.length === 1) {
        await transaction.chat.delete({
          where: {
            roomId,
          },
        })
        await transaction.charactersInRoom.deleteMany({
          where: {
            characterId: characterId
          }
        })
        await transaction.room.update({
          where: {
            id: roomId
          },
          data: {
            status: false,
          }
        })

        return res.json({ message: "You delete the room" }).status(200)
      }

      if (charactersInRoom.length >= 2) {
        if (chat?.userBId === id) {
          await transaction.chat.update({
            where: {
              roomId,
            },
            data: {
              userBId: null,
            }
          })
        } else if (chat?.userCId === id) {
          await transaction.chat.update({
            where: {
              roomId,
            },
            data: {
              userCId: null,
            }
          })
        } else {
          await transaction.chat.update({
            where: {
              roomId,
            },
            data: {
              userDId: null,
            }
          })
        }
      }

      await transaction.charactersInRoom.deleteMany({
        where: {
          characterId: characterId
        }
      })

      res.json({ message: "You left the room" }).status(200)
    })
  } catch (error) {
    return next({ message: "Can't left the room", status: 400 })
  }
}
