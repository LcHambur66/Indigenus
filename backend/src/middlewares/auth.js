import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { ApiError, asyncHandler } from './errors.js';

export function authenticate(db, config) {
  return asyncHandler(async (req, res, next) => {
    const match = /^Bearer ([^\s]+)$/i.exec(req.headers.authorization || '');
    if (!match) throw new ApiError(401, 'Informe o token Bearer.');
    let payload;
    try {
      payload = jwt.verify(match[1], config.jwtSecret, { algorithms: ['HS256'], issuer: 'indigenus-api', audience: 'indigenus-client' });
      if (!z.string().uuid().safeParse(payload.jti).success || !/^[1-9]\d*$/.test(payload.sub) || Number(payload.sub) > 2147483647) throw new Error();
    } catch { throw new ApiError(401, 'Token inválido ou expirado.'); }
    const { rows } = await db.query('SELECT u.id, u.nome, u.email, u.papel FROM usuarios u JOIN sessoes s ON s.usuario_id = u.id WHERE s.id = $1 AND u.id = $2 AND s.expira_em > NOW()', [payload.jti, Number(payload.sub)]);
    if (!rows[0]) throw new ApiError(401, 'Sessão encerrada ou expirada.');
    req.usuario = rows[0];
    req.sessionId = payload.jti;
    next();
  });
}
export function administrator(req, res, next) {
  if (req.usuario.papel !== 'administrador') return next(new ApiError(403, 'Esta operação exige um administrador.'));
  next();
}
