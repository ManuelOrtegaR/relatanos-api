import { Router } from 'express';
import { router as auth } from './auth/routes.ts';
import { router as user } from './users/routes.ts';
import { router as character } from './characters/routes.ts';
import { router as avatar } from './avatar/routes.ts';
import { router as room } from './rooms/routes.ts';
import { router as conversation } from './conversations/routes.ts';
import { router as chat } from './chat/routes.ts';
import { router as message } from './messages/routes.ts';
import { router as question } from './questions/routes.ts';

export const router = Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/characters', character);
router.use('/avatar', avatar);
router.use('/rooms', room);
router.use('/chats', chat);
router.use('/conversations', conversation);
router.use('/messages', message);
router.use('/questions', question);
