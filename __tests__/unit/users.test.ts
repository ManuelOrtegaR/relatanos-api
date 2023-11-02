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
    const responseGetAllUsers = await request(app).get('/api/user').expect(200)
    expect(responseGetAllUsers.body).toEqual([])
    expect(responseGetAllUsers.body.length).toBe(0)

    const user = await getUser()

    const newResponseGetAllUsers = await request(app).get('/api/user').expect(200)
    expect(newResponseGetAllUsers.body[0].email).toEqual(user.email)
    expect(newResponseGetAllUsers.body.length).toBe(1)
  })

  test('Testing users by id', async () => {
    const user = await getUser()
    const responseGetUserById = await request(app).get(`/api/user/${user.id}`).expect(200)
    expect(responseGetUserById.body.email).toEqual(user.email)
    expect(responseGetUserById.body.id).toEqual(user.id)

    const responseGetUserByBadId = await request(app).get(`/api/user/6542b517b430fe23f86559fc`).expect(400)
    expect(responseGetUserByBadId.body.error.message).toEqual('Invalid user')
    // Testing sending invalid Mongo ID
    await request(app).get(`/api/user/123456789`).expect(500)

    const responseUpdateUserById = await request(app).put(`/api/user/${user.id}`).send({
      coins: 200,
      suscription: true,
      status: "inactive"
    }).expect(200)
    expect(responseUpdateUserById.body.coins).toEqual(200)
    expect(responseUpdateUserById.body.suscription).toEqual(true)
    expect(responseUpdateUserById.body.status).toEqual("inactive")

    const responseUpdateUserByIdWithBadData = await request(app).put(`/api/user/${user.id}`).send({
      coins: "200"
    }).expect(400)
    expect(responseUpdateUserByIdWithBadData.body.error.message).toEqual("Incorrect data provided")
  })

  test('Testing activation users', async () => {
    const user = await getUser()

    // Change user status to inactive
    await request(app).put(`/api/user/${user.id}`).send({
      status: "inactive"
    }).expect(200)

    const responseActivateUserById = await request(app).put(`/api/user/${user.id}/activate`).expect(200)
    expect(responseActivateUserById.body.status).toEqual("active")
  })
})
