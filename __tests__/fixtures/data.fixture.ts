import { faker } from '@faker-js/faker';

export const getUserData = (overrides = {}) => {
  const nickname = faker.internet.userName()
  const email = faker.internet.email().toUpperCase()
  const firebaseUid = faker.internet.password()
  const birthdate = faker.date.birthdate().toDateString()

  return Object.assign({
    nickname,
    email,
    firebaseUid,
    birthdate
  },
    overrides,
  )
}

type AvatarCategory = {
  id: string,
  spriteName: string,
  spriteUrl: string,
  spriteColor?: string
}

type Category = {
  id: string,
  language?: string,
  gender?: string
}

export const getCharacterData = (id: string, genders: Category[], languages: Category[], overrides = {}) => {
  const name = faker.person.fullName()
  const description = faker.person.bio()
  const characteristics = faker.person.jobDescriptor()
  const nacionality = faker.location.city()
  const age = faker.number.int({ min: 18, max: 80 }).toString()
  const genderId = faker.helpers.arrayElement(genders).id
  const languageId = faker.helpers.arrayElement(languages).id
  const userId = id

  return Object.assign({
    name,
    description,
    characteristics,
    nacionality,
    age,
    genderId,
    languageId,
    userId
  },
    overrides,
  )
}

export const getAvatarData = (faces: AvatarCategory[], eyes: AvatarCategory[], hairs: AvatarCategory[], mouths: AvatarCategory[], overrides = {}) => {
  const faceId = faker.helpers.arrayElement(faces).id
  const eyeId = faker.helpers.arrayElement(eyes).id
  const hairId = faker.helpers.arrayElement(hairs).id
  const mouthId = faker.helpers.arrayElement(mouths).id

  return Object.assign({
    faceId,
    eyeId,
    hairId,
    mouthId
  },
    overrides,
  )
}
