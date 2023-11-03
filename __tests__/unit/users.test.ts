import { beforeEach, describe, expect, test } from 'vitest';
import { resetDb } from "../helpers/reset-db.ts"
import { app } from "../../app/index.ts"
import request from 'supertest';
import { getUser } from '../helpers/createUser.ts';

describe('Testing users endopints', () => {
  beforeEach(async () => {
    await resetDb()
  })

  test('Get all users', async () => {
    const user = await getUser()

    const responseSignin = await request(app)
      .post('/api/auth/signin')
      .send({ firebaseUid: user.firebaseUid })
      .expect(200)
    expect(responseSignin.body).toContain({ message: 'Login successfully' })

    const token = responseSignin.body.meta.token

    const ResponseGetAllUsers = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(ResponseGetAllUsers.body[0].email).toEqual(user.email)
    expect(ResponseGetAllUsers.body.length).toBe(1)
  })

  test('Testing users by id', async () => {
    const user = await getUser()

    const responseSignin = await request(app)
      .post('/api/auth/signin')
      .send({ firebaseUid: user.firebaseUid })
      .expect(200)
    expect(responseSignin.body).toContain({ message: 'Login successfully' })

    const token = responseSignin.body.meta.token

    const responseGetUserById = await request(app)
      .get(`/api/user/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(responseGetUserById.body.email).toEqual(user.email)
    expect(responseGetUserById.body.id).toEqual(user.id)

    const responseGetUserByBadId = await request(app)
      .get(`/api/user/6542b517b430fe23f86559fc`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
    expect(responseGetUserByBadId.body.error.message).toEqual('Invalid user')
    // Testing sending invalid Mongo ID
    await request(app)
      .get(`/api/user/123456789`)
      .set('Authorization', `Bearer ${token}`)
      .expect(500)

    const responseUpdateUserById = await request(app)
      .put(`/api/user/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        coins: 200,
        suscription: true,
        status: "inactive"
      })
      .expect(200)
    expect(responseUpdateUserById.body.coins).toEqual(200)
    expect(responseUpdateUserById.body.suscription).toEqual(true)
    expect(responseUpdateUserById.body.status).toEqual("inactive")

    const responseUpdateUserByIdWithBadData = await request(app)
      .put(`/api/user/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ coins: "200" })
      .expect(400)
    expect(responseUpdateUserByIdWithBadData.body.error.message).toEqual("Incorrect data provided")
  })

  test('Testing activation users', async () => {
    const user = await getUser()

    const responseSignin = await request(app)
      .post('/api/auth/signin')
      .send({ firebaseUid: user.firebaseUid })
      .expect(200)
    expect(responseSignin.body).toContain({ message: 'Login successfully' })

    const token = responseSignin.body.meta.token

    // Change user status to inactive
    await request(app)
      .put(`/api/user/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: "inactive" }).expect(200)

    const responseActivateUserById = await request(app)
      .put(`/api/user/${user.id}/activate`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(responseActivateUserById.body.status).toEqual("active")
  })
})
