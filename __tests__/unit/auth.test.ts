import { beforeEach, describe, expect, test } from 'vitest';
import { resetDb } from "../helpers/reset-db.ts"
import { app } from "../../app/index.ts"
import request from 'supertest';
import { getUser } from '../helpers/createUser.ts';
import { getUserData } from '../fixtures/data.fixture.ts';

describe('Testing auth endopints', () => {
  beforeEach(async () => {
    await resetDb()
  })

  test('Signup tests', async () => {
    const user = getUserData()
    const responseSignup = await request(app).post('/api/auth/signup').send(user).expect(201)
    expect(responseSignup.body).toEqual({ "message": "User created successfully" })

    const duplicatedResponseSignup = await request(app).post('/api/auth/signup').send(user).expect(400)
    expect(duplicatedResponseSignup.body.error.message).toEqual("Can't create user")

    const badUser = getUserData({ email: null })
    const badResponseSignup = await request(app).post('/api/auth/signup').send(badUser).expect(400)
    expect(badResponseSignup.body.error.message).toEqual('Incorrect data provided')
  })

  test('SignIn tests', async () => {
    const user = await getUser()

    const responseSignin = await request(app).post('/api/auth/signin').send({
      email: user.email,
      password: user.decryptedPassword,
    }).expect(200)
    expect(responseSignin.body).toEqual({ message: 'Login successfully' })

    const wrongPasswordResponseSignin = await request(app).post('/api/auth/signin').send({
      email: user.email,
      password: "BadPassword123",
    }).expect(400)
    expect(wrongPasswordResponseSignin.body.error.message).toEqual("Wrong email or password")

    const wrongDataResponseSignin = await request(app).post('/api/auth/signin').send({
      email: user.email,
      password: "badPassword",
    }).expect(400)
    expect(wrongDataResponseSignin.body.error.message).toEqual("Wrong email or password")

    const badUserResponseSignin = await request(app).post('/api/auth/signin').send({
      email: "baduser@baduser.com",
      password: "BadPassword123",
    }).expect(400)
    expect(badUserResponseSignin.body.error.message).toEqual("Wrong email or password")

    const newUser = getUserData()
    const responseSignup = await request(app).post('/api/auth/signup').send(newUser).expect(201)
    expect(responseSignup.body).toEqual({ "message": "User created successfully" })

    const emailVerifyResponseSignin = await request(app).post('/api/auth/signin').send({
      email: newUser.email,
      password: newUser.password,
    }).expect(400)
    expect(emailVerifyResponseSignin.body.error.message).toEqual("Need to verify your email account")
  })
})
