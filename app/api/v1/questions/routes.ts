import { Router } from 'express';
import * as controller from './controller.ts';

export const router = Router();

/**
 * /api/v1/questions/ METHOD: GET - Get all questions
 * /api/v1/questions/ METHOD: POST - Create a question
 * /api/v1/questions/:id METHOD: GET - Get question by id
 * /api/v1/questions/:id METHOD: PUT - Update question by id
 * /api/v1/questions/:id METHOD: PATCH - Update question by id
 */

router.route('/').get(controller.getAllQuestions).post(controller.createQuestion);

router.param('id', controller.questionId);
router
  .route('/:id')
  .get(controller.getQuestionById)
  .put(controller.updateQuestionById)
  .patch(controller.updateQuestionById);
