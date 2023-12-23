import { Router } from 'express';
import * as controller from './controller.ts';
import { auth } from '../auth.ts';

export const router = Router();

/**
 * /api/v1/user/ METHOD: GET - Get all users
 * /api/v1/user/:id METHOD: GET - Get user by id
 * /api/v1/user/:id METHOD: PUT - Update user by id
 * /api/v1/user/:id METHOD: PATCH - Update user by id
 * /api/v1/user/:id/activate METHOD: PUT - Change user status to "active" by id
 * /api/v1/user/:id/activate METHOD: PATCH - Change user status to "active" by id
 */

router.route('/').get(auth, controller.getAllUsers);
router.route('/me').get(auth, controller.getMyUser);

router.param('id', controller.userId);
router
  .route('/:id')
  .get(auth, controller.getUserById)
  .put(auth, controller.updateUserById)
  .patch(auth, controller.updateUserById);

router
  .route('/:id/activate')
  .put(auth, controller.activateUserById)
  .patch(auth, controller.activateUserById)
