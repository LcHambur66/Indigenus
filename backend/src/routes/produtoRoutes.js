import { Router } from 'express';
import { requireAdmin } from '../middlewares/authMiddleware.js';
import {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto,
} from '../controllers/produtoController.js';

const router = Router();

// Mapeamento das rotas do CRUD de produtos
router.get('/', listarProdutos);
router.get('/:id', buscarProdutoPorId);
router.post('/', requireAdmin, criarProduto);
router.put('/:id', requireAdmin, atualizarProduto);
router.delete('/:id', requireAdmin, deletarProduto);

export default router;
