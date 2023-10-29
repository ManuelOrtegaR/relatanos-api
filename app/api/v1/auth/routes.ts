import { Router } from 'express';
import * as controller from './controller.ts';

export const router = Router();

router.route('/signup').post(controller.signup);
router.route('/signin').post(controller.signin);
