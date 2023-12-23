import { Router } from 'express';
import * as controller from './controller.ts';
import { auth } from '../auth.ts';

export const router = Router();

/**
 * /api/v1/chat/ METHOD: GET - Get all chats
 * /api/v1/chat/ METHOD: POST - Create a chat
 * /api/v1/chat/:id METHOD: GET - Get chat by id
 */

router.route('/').get(auth, controller.getAllChats)

router.param('id', controller.chatId);
router
  .route('/:id')
  .get(auth, controller.getChatById)
