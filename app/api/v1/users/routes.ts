import { Router } from 'express';
import * as controller from './controller.ts';

export const router = Router();

/**
 * /api/v1/user/ METHOD: GET - Get all users
 */

router.route('/').get(controller.getAllUsers);

