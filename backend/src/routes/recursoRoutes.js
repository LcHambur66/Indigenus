import { Router } from 'express';
import { administrator } from '../middlewares/auth.js';
import { asyncHandler } from '../middlewares/errors.js';
import { validate, validateId } from '../validations/schemas.js';
import { recursoController } from '../controllers/recursoController.js';

export function recursoRoutes(service, schema, auth) {
  const router = Router();
  const controller = recursoController(service);
  router.use(auth);
  router.get('/', asyncHandler(controller.listar));
  router.get('/:id', validateId, asyncHandler(controller.buscar));
  router.post('/', administrator, validate(schema), asyncHandler(controller.criar));
  router.put('/:id', administrator, validateId, validate(schema), asyncHandler(controller.atualizar));
  router.delete('/:id', administrator, validateId, asyncHandler(controller.excluir));
  return router;
}
