import { Router } from 'express';
import { router as auth } from './auth/routes.ts';

export const router = Router();

router.use('/auth', auth);
