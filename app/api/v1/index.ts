import { Router } from 'express';
import { router as auth } from './auth/routes.ts';
import { router as user } from './users/routes.ts';

export const router = Router();

router.use('/auth', auth);
router.use('/user', user);
