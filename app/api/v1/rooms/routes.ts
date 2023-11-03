import { Router } from 'express';
import * as controller from './controller.ts';
import { auth } from '../auth.ts';

export const router = Router();

/**
 * /api/v1/room/ METHOD: GET - Get all rooms
 * /api/v1/room/ METHOD: POST - Create a room
 * /api/v1/room/:id METHOD: GET - Get room by id
 * /api/v1/room/:id METHOD: PUT - Update room by id
 * /api/v1/room/:id METHOD: PATCH - Update room by id
 * /api/v1/room/:id/activate METHOD: PUT - Change room status to "active" by id
 * /api/v1/room/:id/activate METHOD: PATCH - Change room status to "active" by id
 */

router.route('/').get(auth, controller.getAllRooms).post(auth, controller.createRoom);

router.param('id', controller.roomId);
router
  .route('/:id')
  .get(auth, controller.getRoomById)
  .put(auth, controller.updateRoomById)
  .patch(auth, controller.updateRoomById);

router.route('/:id/join').post(auth, controller.joinRoom)
router.route('/:id/exit').post(auth, controller.exitRoom)
