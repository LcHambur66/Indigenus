import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { authService } from '../services/authService.js';
import { asyncHandler } from '../middlewares/errors.js';
import { cadastroSchema, loginSchema, perfilSchema, validate } from '../validations/schemas.js';

export function authRoutes(db, config, auth) {
  const router = Router();
  const service = authService(db, config);
  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false, message: { mensagem: 'Muitas tentativas. Tente novamente em 15 minutos.' } });
  router.post('/cadastro', limiter, validate(cadastroSchema), asyncHandler(async (req, res) => res.status(201).json(await service.cadastrar(req.body))));
  router.post('/login', limiter, validate(loginSchema), asyncHandler(async (req, res) => res.json(await service.login(req.body))));
  router.post('/logout', auth, asyncHandler(async (req, res) => { await service.logout(req.sessionId); res.status(204).send(); }));
  router.get('/me', auth, (req, res) => res.json(req.usuario));
  router.put('/me', auth, validate(perfilSchema), asyncHandler(async (req, res) => res.json(await service.atualizarPerfil(req.usuario.id, req.body))));
  return router;
}
