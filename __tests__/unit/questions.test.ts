import { beforeEach, describe, expect, test } from 'vitest';
import { resetDb } from "../helpers/reset-db.ts"
import { app } from "../../app/index.ts"
import request from 'supertest';
import { getUser } from '../helpers/createUser.ts';

describe('Testing questions endopints', () => {
  beforeEach(async () => {
    await resetDb()
  })

  test('Get all questions', async () => {
    const user = await getUser()

    const responseSignin = await request(app)
      .post('/api/auth/signin')
      .send({ firebaseUid: user.firebaseUid })
      .expect(200)
    expect(responseSignin.body).toContain({ message: 'Login successfully' })

    const token = responseSignin.body.meta.token

    const responseGetAllQuestions = await request(app)
      .get('/api/questions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(responseGetAllQuestions.body.length).toBe(0)

    const responseCreateQuestion = await request(app)
      .post('/api/questions')
      .send({ name: user.nickname, email: user.email, message: "Question message" })
      .expect(200)
    expect(responseCreateQuestion.body).toEqual({ message: "Succesfully created" })
  })

  test('Testing questions by id', async () => {
    const user = await getUser()

    const responseSignin = await request(app)
      .post('/api/auth/signin')
      .send({ firebaseUid: user.firebaseUid })
      .expect(200)
    expect(responseSignin.body).toContain({ message: 'Login successfully' })

    const token = responseSignin.body.meta.token

    const responseCreateQuestion = await request(app)
      .post('/api/questions')
      .send({ name: user.nickname, email: user.email, message: "Question message" })
      .expect(200)
    expect(responseCreateQuestion.body).toEqual({ message: "Succesfully created" })

    const responseGetAllQuestions = await request(app)
      .get('/api/questions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const questionId = responseGetAllQuestions.body[0].id

    const responseGetQuestionById = await request(app)
      .get(`/api/questions/${questionId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    expect(responseGetQuestionById.body.contactEmail).toEqual(user.email)

    const responseGetQuestionByBadId = await request(app)
      .get(`/api/questions/6542b517b430fe23f86559fc`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
    expect(responseGetQuestionByBadId.body.error.message).toEqual('Invalid question')
    // Testing sending invalid Mongo ID
    await request(app)
      .get(`/api/questions/123456789`)
      .set('Authorization', `Bearer ${token}`)
      .expect(500)

    const responseUpdateQuestionById = await request(app)
      .put(`/api/questions/${questionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        answer: "Question answer",
        questionStatus: true,
      })
      .expect(200)
    expect(responseUpdateQuestionById.body.questionStatus).toEqual(true)
    expect(responseUpdateQuestionById.body.answer).toEqual("Question answer")

    const responseUpdateQuestionByIdWithBadData = await request(app)
      .put(`/api/questions/${questionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ questionStatus: "200" })
      .expect(400)
    expect(responseUpdateQuestionByIdWithBadData.body.error.message).toEqual("Incorrect data provided")
  })
})
