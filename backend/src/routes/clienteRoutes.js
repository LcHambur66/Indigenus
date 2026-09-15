import { Router } from 'express';
import * as controller from '../controllers/clienteController.js';
import { authMiddleware, requireAdmin } from '../middlewares/authMiddleware.js';

const router = Router();
router.use(authMiddleware);
router.get('/me', controller.meuPerfil);
router.put('/me', controller.atualizarMeuPerfil);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', requireAdmin, controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', requireAdmin, controller.remover);
export default router;
