import { beforeEach, describe, expect, test } from 'vitest';
import { resetDb } from "../helpers/reset-db.ts"
import { app } from "../../app/index.ts"
import request from 'supertest';
import { getCategories, getCharacter, getRoom, getUser } from '../helpers/createUser.ts';

describe('Testing conversation and message endopints', () => {
  beforeEach(async () => {
    await resetDb()
  })

  test('Get all conversations', async () => {
    const user = await getUser()
    const user2 = await getUser()

    const responseSignin = await request(app)
      .post('/api/auth/signin')
      .send({ firebaseUid: user.firebaseUid })
      .expect(200)
    expect(responseSignin.body).toContain({ message: 'Login successfully' })

    const token = responseSignin.body.meta.token
    const userAId = user.id
    const userBId = user2.id

    const responseGetAllConversations = await request(app)
      .get('/api/conversations')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(responseGetAllConversations.body.length).toBe(0)

    const responseCreateConversation = await request(app)
      .post('/api/conversations')
      .set('Authorization', `Bearer ${token}`)
      .send({ userBId })
      .expect(200)
    expect(responseCreateConversation.body.userAId).toEqual(userAId)
    expect(responseCreateConversation.body.userBId).toEqual(userBId)

    const responseGetAllConversations2 = await request(app)
      .get('/api/conversations')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(responseGetAllConversations2.body.length).toBe(1)
  })

  test('Create messages', async () => {
    const user = await getUser()
    const user2 = await getUser()

    const responseSignin = await request(app)
      .post('/api/auth/signin')
      .send({ firebaseUid: user.firebaseUid })
      .expect(200)
    expect(responseSignin.body).toContain({ message: 'Login successfully' })

    const token = responseSignin.body.meta.token
    const userBId = user2.id

    const responseCreateConversation = await request(app)
      .post('/api/conversations')
      .set('Authorization', `Bearer ${token}`)
      .send({ userBId })
      .expect(200)

    const conversationId = responseCreateConversation.body.id

    const responseCreateMessage = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: "New message", conversationId })
      .expect(200)
    expect(responseCreateMessage.body.content).toEqual("New message")

    const responseCreateMessageBadId = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: "New message", conversationId: "123456789" })
      .expect(400)
    expect(responseCreateMessageBadId.body.error.message).toEqual("Can't create message")

    const responseCreateMessageBadData = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 123, conversationId })
      .expect(400)
    expect(responseCreateMessageBadData.body.error.message).toEqual("Incorrect data provided")
  })

  test('Testing get conversations by id', async () => {
    const user = await getUser()
    const user2 = await getUser()

    const responseSignin = await request(app)
      .post('/api/auth/signin')
      .send({ firebaseUid: user.firebaseUid })
      .expect(200)
    expect(responseSignin.body).toContain({ message: 'Login successfully' })

    const token = responseSignin.body.meta.token
    const userAId = user.id
    const userBId = user2.id

    const responseCreateConversation = await request(app)
      .post('/api/conversations')
      .set('Authorization', `Bearer ${token}`)
      .send({ userBId })
      .expect(200)

    const conversationId = responseCreateConversation.body.id

    const responseGetConversationById = await request(app)
      .get(`/api/conversations/${conversationId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(responseGetConversationById.body.userAId).toEqual(userAId)
    expect(responseGetConversationById.body.userBId).toEqual(userBId)
  })
})
