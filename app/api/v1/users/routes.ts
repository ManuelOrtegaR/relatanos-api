import { Router } from 'express';
import * as controller from './controller.ts';

export const router = Router();

router.route('/').get(controller.getAllUsers);

