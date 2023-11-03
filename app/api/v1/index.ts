import { Router } from 'express';
import { router as auth } from './auth/routes.ts';
import { router as user } from './users/routes.ts';
import { router as character } from './characters/routes.ts';
import { router as room } from './rooms/routes.ts';
import { router as conversation } from './conversations/routes.ts';
import { router as question } from './questions/routes.ts';

export const router = Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/characters', character);
router.use('/rooms', room);
router.use('/conversations', conversation);
router.use('/questions', question);
