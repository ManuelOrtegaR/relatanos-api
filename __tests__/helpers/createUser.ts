import { prisma } from "../../app/database.ts"
import { getAvatarData, getCharacterData, getUserData } from "../fixtures/data.fixture.ts"

export const getUser = async (overrides = {}) => {
  const { nickname, email, firebaseUid, birthdate } = getUserData(overrides)
  try {
    const result = await prisma.user.create({
      data: {
        nickname,
        email,
        firebaseUid,
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
    }
  } catch (error) {
    return {
      id: "exampleid",
      nickname: "example",
      email: "example@example.com",
      firebaseUid: "Example123",
      birthdate: "01/01/2000",
      picture: "https://placehold.co/400",
      emailVerify: true,
      suscription: false,
      coins: 100,
      gems: 0,
      notifications: true
    }
  }
}

export const getCharacter = async (id: string, overrides = {}) => {
  const { genders, eyes, faces, hairs, languages, mouths } = await getCategories()
  const characterData = getCharacterData(id, genders, languages)
  const avatarData = getAvatarData(eyes, hairs, mouths, faces)

  const resultCharacter = await prisma.character.create({
    data: {
      status: "active",
      ...characterData
    }
  })

  const resultAvatar = await prisma.avatar.create({
    data: {
      characterId: resultCharacter.id,
      ...avatarData
    }
  })

  return {
    resultCharacter,
    resultAvatar
  }
}

export const getCategories = async () => {

  const genders = await prisma.gender.findMany({})
  const languages = await prisma.language.findMany({})
  const faces = await prisma.face.findMany({})
  const hairs = await prisma.hair.findMany({})
  const mouths = await prisma.mouth.findMany({})
  const eyes = await prisma.eye.findMany({})

  return {
    genders,
    languages,
    faces,
    hairs,
    mouths,
    eyes
  }
}
