import { prisma } from "../../app/database.ts";

export const resetDb = async () => {
  await prisma.$transaction([
    prisma.questions.deleteMany(),
    prisma.saved.deleteMany(),
    prisma.message.deleteMany(),
    prisma.conversation.deleteMany(),
    prisma.chat.deleteMany(),
    prisma.room.deleteMany(),
    prisma.rating.deleteMany(),
    prisma.rating.deleteMany(),
    prisma.avatar.deleteMany(),
    prisma.avatar.deleteMany(),
    prisma.character.deleteMany(),
    prisma.friends.deleteMany(),
    prisma.user.deleteMany(),
  ]);
};
