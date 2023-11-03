import { Router } from 'express';
import * as controller from './controller.ts';
import { auth } from '../auth.ts';

export const router = Router();

/**
 * /api/v1/messages/ METHOD: POST - Create a message
 */

router.route('/').post(auth, controller.createMessage);
