import { prisma } from "../../app/database.ts"
import { encryptPassword } from "../../app/utils.ts"
import { getUserData } from "../fixtures/data.fixture.ts"

export const getUser = async (overrides = {}) => {
  const { nickname, email, password, birthdate } = getUserData(overrides)
  try {
    const encryptedPassword = await encryptPassword(password)
    const result = await prisma.user.create({
      data: {
        nickname,
        email,
        password: encryptedPassword,
        birthdate,
        picture: "https://placehold.co/400",
        emailVerify: true,
        suscription: false,
        coins: 100,
        gems: 0,
        notifications: true,
        status: "active"
      }
    })

    return {
      ...result,
      decryptedPassword: password
    }
  } catch (error) {
    return {
      nickname: "example",
      email: "example@example.com",
      password: "Example123",
      birthdate: "01/01/2000",
      picture: "https://placehold.co/400",
      emailVerify: true,
      suscription: false,
      coins: 100,
      gems: 0,
      notifications: true,
      decryptedPassword: password
    }
  }
}
