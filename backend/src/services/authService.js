import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { ApiError } from '../middlewares/errors.js';

export const publicUser = user => ({ id: user.id, nome: user.nome, email: user.email, papel: user.papel });
export const hashPassword = senha => bcrypt.hash(senha, 12);
const dummyHash = bcrypt.hashSync('senha-apenas-para-comparacao-interna', 12);

export function authService(db, config) {
  return {
    async cadastrar({ nome, email, senha }) {
      const hash = await hashPassword(senha);
      const { rows } = await db.query('INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email, papel', [nome, email, hash]);
      return rows[0];
    },
    async login({ email, senha }) {
      const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
      const user = rows[0];
      const valid = await bcrypt.compare(senha, user?.senha_hash || dummyHash);
      if (!user || !valid) throw new ApiError(401, 'E-mail ou senha incorretos.');
      const jti = randomUUID();
      const token = jwt.sign({}, config.jwtSecret, { algorithm: 'HS256', subject: String(user.id), jwtid: jti, expiresIn: '1h', issuer: 'indigenus-api', audience: 'indigenus-client' });
      const { exp } = jwt.decode(token);
      await db.query('DELETE FROM sessoes WHERE expira_em <= NOW()');
      await db.query('INSERT INTO sessoes (id, usuario_id, expira_em) VALUES ($1, $2, $3)', [jti, user.id, new Date(exp * 1000)]);
      return { token, tipo: 'Bearer', expira_em: new Date(exp * 1000).toISOString(), usuario: publicUser(user) };
    },
    async logout(sessionId) { await db.query('DELETE FROM sessoes WHERE id = $1', [sessionId]); },
    async atualizarPerfil(userId, { nome, email }) {
      const { rows } = await db.query('UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3 RETURNING id, nome, email, papel', [nome, email, userId]);
      if (!rows[0]) throw new ApiError(404, 'Usuário não encontrado.');
      return rows[0];
    },
  };
}
