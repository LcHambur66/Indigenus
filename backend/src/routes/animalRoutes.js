import { Router } from 'express';
import * as controller from '../controllers/animalController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();
router.use(authMiddleware);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.remover);
export default router;
