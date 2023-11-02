import { Router } from 'express';
import * as controller from './controller.ts';

export const router = Router();

/**
 * /api/v1/conversations/ METHOD: GET - Get all conversations
 * /api/v1/conversations/ METHOD: POST - Create a conversation
 * /api/v1/conversations/:id METHOD: GET - Get conversation by id
 * /api/v1/conversations/:id METHOD: PUT - Update conversation by id
 * /api/v1/conversations/:id METHOD: PATCH - Update conversation by id
 */

router.route('/').get(controller.getAllConversations).post(controller.createConversation);
router.route('/me').post(controller.listMyConversations);

router.param('id', controller.conversationId);
router
  .route('/:id')
  .get(controller.getConversationById)
//   .put(controller.updateConversationById)
//   .patch(controller.updateConversationById);
