import { beforeEach, describe, expect, test } from 'vitest';
import { resetDb } from "../helpers/reset-db.ts"
import { app } from "../../app/index.ts"
import request from 'supertest';
import { getCharacter, getUser } from '../helpers/createUser.ts';

describe('Testing characters endopints', () => {
  beforeEach(async () => {
    await resetDb()
  })

  test('Get all characters', async () => {
    const responseGetAllcharacters = await request(app).get('/api/characters').expect(200)
    expect(responseGetAllcharacters.body).toEqual([])
    expect(responseGetAllcharacters.body.length).toBe(0)

    const user = await getUser()
    const character = await getCharacter(user.id)

    const newResponseGetAllcharacters = await request(app).get('/api/characters').expect(200)
    expect(newResponseGetAllcharacters.body[0].name).toEqual(character.resultCharacter.name)
    expect(newResponseGetAllcharacters.body.length).toBe(1)
  })

  test('Testing characters by id', async () => {
    const user = await getUser()
    const character = await getCharacter(user.id)
    const responseGetCharacterById = await request(app).get(`/api/characters/${character.resultCharacter.id}`).expect(200)
    expect(responseGetCharacterById.body.name).toEqual(character.resultCharacter.name)
    expect(responseGetCharacterById.body.id).toEqual(character.resultCharacter.id)

    const responseGetCharacterByBadId = await request(app).get(`/api/characters/6542b517b430fe23f86559fc`).expect(400)
    expect(responseGetCharacterByBadId.body.error.message).toEqual('Invalid character')
    // Testing sending invalid Mongo ID
    await request(app).get(`/api/characters/123456789`).expect(500)

    const responseUpdateCharacterById = await request(app).put(`/api/characters/${character.resultCharacter.id}`).send({
      name: "newName",
      status: "inactive"
    }).expect(200)
    expect(responseUpdateCharacterById.body.name).toEqual("newName")
    expect(responseUpdateCharacterById.body.status).toEqual("inactive")

    const responseUpdateCharacterByIdWithBadData = await request(app).put(`/api/characters/${character.resultCharacter.id}`).send({
      name: true,
    }).expect(400)
    expect(responseUpdateCharacterByIdWithBadData.body.error.message).toEqual("Incorrect data provided")
  })

  test('Testing activation characters', async () => {
    const user = await getUser()
    const character = await getCharacter(user.id)

    // Change character status to inactive
    await request(app).put(`/api/characters/${character.resultCharacter.id}`).send({
      status: "inactive"
    }).expect(200)

    const responseActivateCharacterById = await request(app).put(`/api/characters/${character.resultCharacter.id}/activate`).expect(200)
    expect(responseActivateCharacterById.body.status).toEqual("active")
  })
})
