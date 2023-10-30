import { faker } from '@faker-js/faker';

export const getUserData = (overrides = {}) => {
  const nickname = faker.internet.userName()
  const email = faker.internet.email().toUpperCase()
  const password = "Contra123"
  const birthdate = faker.date.birthdate().toDateString()

  return Object.assign({
    nickname,
    email,
    password,
    birthdate
  },
    overrides,
  )
}
