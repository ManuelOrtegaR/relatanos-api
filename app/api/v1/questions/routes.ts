import { Router } from 'express';
import * as controller from './controller.ts';
import { auth } from '../auth.ts';

export const router = Router();

/**
 * /api/v1/questions/ METHOD: GET - Get all questions
 * /api/v1/questions/ METHOD: POST - Create a question
 * /api/v1/questions/:id METHOD: GET - Get question by id
 * /api/v1/questions/:id METHOD: PUT - Update question by id
 * /api/v1/questions/:id METHOD: PATCH - Update question by id
 */

router.route('/').get(auth, controller.getAllQuestions).post(controller.createQuestion);

router.param('id', controller.questionId);
router
  .route('/:id')
  .get(auth, controller.getQuestionById)
  .put(auth, controller.updateQuestionById)
  .patch(auth, controller.updateQuestionById);
