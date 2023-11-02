import { Router } from 'express';
import { router as auth } from './auth/routes.ts';
import { router as user } from './users/routes.ts';
import { router as character } from './characters/routes.ts';

export const router = Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/characters', character);
