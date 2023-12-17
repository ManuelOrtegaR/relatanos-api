import { Router } from 'express';
import * as controller from './controller.ts';
import { auth } from '../auth.ts';

export const router = Router();

/**
 * /api/v1/character/ METHOD: GET - Get all csprites
 * /api/v1/character/:id METHOD: GET - Get sprites by id

 */
// TODO: get only my characters
// TODO: comment avatars verification and prove
router.route('/').get(auth, controller.getAllSprites)

router.param('id', controller.spriteId);
router
  .route('/:id')
  .post(auth, controller.getSpriteById)

