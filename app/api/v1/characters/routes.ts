import { Router } from 'express';
import * as controller from './controller.ts';

export const router = Router();

/**
 * /api/v1/character/ METHOD: GET - Get all characters
 * /api/v1/character/ METHOD: POST - Create a character
 * /api/v1/character/:id METHOD: GET - Get character by id
 * /api/v1/character/:id METHOD: PUT - Update character by id
 * /api/v1/character/:id METHOD: PATCH - Update character by id
 * /api/v1/character/:id/activate METHOD: PUT - Change character status to "active" by id
 * /api/v1/character/:id/activate METHOD: PATCH - Change character status to "active" by id
 */

router.route('/').get(controller.getAllCharacters).post(controller.createCharacter);
router.route('/userId').post(controller.getAllCharactersByUser);

router.param('id', controller.characterId);
router
  .route('/:id')
  .get(controller.getCharacterById)
  .put(controller.updateCharacterUserById)
  .patch(controller.updateCharacterUserById);

router
  .route('/:id/activate')
  .put(controller.activateCharacterById)
  .patch(controller.activateCharacterById)
