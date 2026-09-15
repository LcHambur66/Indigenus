import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { fileURLToPath } from 'node:url';
import { authenticate } from './middlewares/auth.js';
import { ApiError, asyncHandler, errorHandler } from './middlewares/errors.js';
import { produtoSchema, categoriaSchema } from './validations/schemas.js';
import { produtoService } from './services/produtoService.js';
import { categoriaService } from './services/categoriaService.js';
import { recursoRoutes } from './routes/recursoRoutes.js';
import { authRoutes } from './routes/authRoutes.js';

export function createApp({ db, config }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: config.origins }));
  app.use(express.json({ limit: '100kb' }));
  app.get('/', (req, res) => res.json({ nome: 'Indigenus API', documentacao: '/api/openapi.json', saude: '/api/health' }));
  app.get('/api/health', asyncHandler(async (req, res) => {
    try { await db.query('SELECT 1'); } catch { throw new ApiError(503, 'Banco de dados indisponível.'); }
    res.json({ status: 'ok' });
  }));
  app.get('/api/openapi.json', (req, res) => res.sendFile(fileURLToPath(new URL('../docs/openapi.json', import.meta.url))));
  app.use('/imagens', express.static(fileURLToPath(new URL('./imgs', import.meta.url))));
  const auth = authenticate(db, config);
  app.use('/api/auth', authRoutes(db, config, auth));
  const produtos = recursoRoutes(produtoService(db), produtoSchema, auth);
  app.use('/api/produtos', produtos);
  app.use('/produtos', produtos);
  app.use('/api/categorias', recursoRoutes(categoriaService(db), categoriaSchema, auth));
  app.use((req, res, next) => next(new ApiError(404, 'Rota não encontrada.')));
  app.use(errorHandler);
  return app;
}
