import { Router } from 'express';
import * as controller from './controller.ts';

export const router = Router();

/**
 * /api/v1/auth/signup METHOD: POST - Create a new user
 * /api/v1/auth/signin METHOD: POST - login with correct credentials
 */

router.route('/signup').post(controller.signup);
router.route('/signin').post(controller.signin);
