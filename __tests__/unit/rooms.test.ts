import { beforeEach, describe, expect, test } from 'vitest';
import { resetDb } from "../helpers/reset-db.ts"
import { app } from "../../app/index.ts"
import request from 'supertest';
import { getCategories, getCharacter, getRoom, getUser } from '../helpers/createUser.ts';

describe('Testing rooms endopints', () => {
  beforeEach(async () => {
    await resetDb()
  })

  test('Get all rooms', async () => {
    const user = await getUser()
    const character = await getCharacter(user.id)

    const responseSignin = await request(app)
      .post('/api/auth/signin')
      .send({ firebaseUid: user.firebaseUid })
      .expect(200)
    expect(responseSignin.body).toContain({ message: 'Login successfully' })

    const token = responseSignin.body.meta.token

    const { languages, litGenres, locations } = await getCategories()
    const { id: characterId } = character.resultCharacter

    const ResponseCreateRoom = await request(app)
      .post('/api/rooms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        characterId, turns: 3,
        languageId: languages[0].id,
        litGenreId: litGenres[0].id,
        locationId: locations[0].id
      })
      .expect(200)
    expect(ResponseCreateRoom.body.room).exist
    expect(ResponseCreateRoom.body.characterInRoom).exist
    expect(ResponseCreateRoom.body.chat).exist

    const ResponseGetAllRooms = await request(app)
      .get('/api/rooms')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(ResponseGetAllRooms.body.length).toBe(1)
  })

  test('Testing users by id', async () => {
    const user = await getUser()
    const character = await getCharacter(user.id)
    const room = await getRoom({ characterId: character.resultCharacter.id, id: user.id })

    const responseSignin = await request(app)
      .post('/api/auth/signin')
      .send({ firebaseUid: user.firebaseUid })
      .expect(200)
    expect(responseSignin.body).toContain({ message: 'Login successfully' })

    const token = responseSignin.body.meta.token

    const responseGetRoomById = await request(app)
      .get(`/api/rooms/${room.room.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(responseGetRoomById.body.id).toEqual(room.room.id)
    expect(responseGetRoomById.body.status).toEqual(true)
    expect(responseGetRoomById.body.charactersInRoom[0].characterId).toEqual(character.resultCharacter.id)

    const responseGetRoomByBadId = await request(app)
      .get(`/api/rooms/6542b517b430fe23f86559fc`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
    expect(responseGetRoomByBadId.body.error.message).toEqual('Invalid room')
    // Testing sending invalid Mongo ID
    await request(app)
      .get(`/api/rooms/123456789`)
      .set('Authorization', `Bearer ${token}`)
      .expect(500)

    const responseUpdateRoomById = await request(app)
      .put(`/api/rooms/${room.room.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ turns: 10 })
      .expect(200)
    expect(responseUpdateRoomById.body.turns).toEqual(10)

    const responseUpdateRoomByIdWithBadData = await request(app)
      .put(`/api/rooms/${room.room.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ turns: "false" })
      .expect(400)
    expect(responseUpdateRoomByIdWithBadData.body.error.message).toEqual("Incorrect data provided")
  })

  test('Testing join and left rooms', async () => {
    const user = await getUser()
    const user2 = await getUser()
    const character = await getCharacter(user.id)
    const character2 = await getCharacter(user2.id)
    const room = await getRoom({ characterId: character.resultCharacter.id, id: user.id })

    const responseSignin = await request(app)
      .post('/api/auth/signin')
      .send({ firebaseUid: user2.firebaseUid })
      .expect(200)
    expect(responseSignin.body).toContain({ message: 'Login successfully' })

    const token = responseSignin.body.meta.token

    const responseJoinRoom = await request(app)
      .post(`/api/rooms/${room.room.id}/join`)
      .set('Authorization', `Bearer ${token}`)
      .send({ characterId: character2.resultCharacter.id })
      .expect(200)
    expect(responseJoinRoom.body).toContain({ message: 'You entered the room' })

    const responseGetRoomById = await request(app)
      .get(`/api/rooms/${room.room.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(responseGetRoomById.body.charactersInRoom.length).toEqual(2)
    expect(responseGetRoomById.body.charactersInRoom[1].characterId).toEqual(character2.resultCharacter.id)

    const responseExitRoom = await request(app)
      .post(`/api/rooms/${room.room.id}/exit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ characterId: character2.resultCharacter.id })
      .expect(200)
    expect(responseExitRoom.body).toContain({ message: 'You left the room' })

    const responseGetRoomById2 = await request(app)
      .get(`/api/rooms/${room.room.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(responseGetRoomById2.body.charactersInRoom.length).toEqual(1)
  })
})
