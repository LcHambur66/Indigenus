import { cadastroSchema } from '../validations/schemas.js';
import { hashPassword } from './authService.js';

export async function createInitialUsers(db, env) {
  const accounts = [['ADMIN', 'administrador'], ['CLIENT', 'usuario']].map(([prefix, papel]) => {
    const result = cadastroSchema.safeParse({
      nome: env[`${prefix}_NAME`],
      email: env[`${prefix}_EMAIL`],
      senha: env[`${prefix}_PASSWORD`],
    });
    if (!result.success) throw new Error(`Configure ${prefix}_NAME, ${prefix}_EMAIL e ${prefix}_PASSWORD válidos no .env. A senha deve ter pelo menos 8 caracteres e até 72 bytes UTF-8.`);
    return { ...result.data, papel };
  });
  if (accounts[0].email === accounts[1].email) throw new Error('ADMIN_EMAIL e CLIENT_EMAIL devem ser diferentes.');

  const client = await db.connect();
  const results = [];
  try {
    await client.query('BEGIN');
    for (const { nome, email, senha, papel } of accounts) {
      const { rows } = await client.query(
        'INSERT INTO usuarios (nome, email, senha_hash, papel) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING RETURNING id',
        [nome, email, await hashPassword(senha), papel],
      );
      if (!rows.length) {
        const existing = await client.query('SELECT papel FROM usuarios WHERE email = $1', [email]);
        if (existing.rows[0]?.papel !== papel) throw new Error(`O e-mail configurado para ${papel} já pertence a outro tipo de conta. Use outro e-mail. Nenhuma conta foi alterada.`);
      }
      results.push({ papel, criada: rows.length > 0 });
    }
    await client.query('COMMIT');
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally { client.release(); }
}
