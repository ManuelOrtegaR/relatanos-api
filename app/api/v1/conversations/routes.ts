import { Router } from 'express';
import * as controller from './controller.ts';
import { auth } from '../auth.ts';

export const router = Router();

/**
 * /api/v1/conversations/ METHOD: GET - Get all conversations
 * /api/v1/conversations/ METHOD: POST - Create a conversation
 * /api/v1/conversations/:id METHOD: GET - Get conversation by id
 */

router.route('/').get(auth, controller.getAllConversations).post(auth, controller.createConversation);

router.param('id', controller.conversationId);
router
  .route('/:id')
  .get(auth, controller.getConversationById)
