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
  const litGenres = await prisma.litGenre.findMany({})
  const locations = await prisma.location.findMany({})


  return {
    genders,
    languages,
    faces,
    hairs,
    mouths,
    eyes,
    litGenres,
    locations
  }
}

export const getRoom = async ({ characterId, id }: { characterId: string, id: string }) => {
  const { languages, litGenres, locations } = await getCategories()
  const room = await prisma.room.create({
    data: {
      turns: 1,
      languageId: languages[0].id,
      litGenreId: litGenres[0].id,
      locationId: locations[0].id,
      status: true
    }
  })

  const { id: roomId } = room

  const characterInRoom = await prisma.charactersInRoom.create({
    data: {
      roomId,
      characterId,
    }
  })

  const chat = await prisma.chat.create({
    data: {
      userAId: id,
      roomId
    }
  })

  return {
    room,
    characterInRoom,
    chat
  }
}
