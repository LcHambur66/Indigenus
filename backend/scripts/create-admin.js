import pool from '../src/database/connection.js';
import { cadastroSchema } from '../src/validations/schemas.js';
import { hashPassword } from '../src/services/authService.js';

try {
  const result = cadastroSchema.safeParse({ nome: process.env.ADMIN_NAME, email: process.env.ADMIN_EMAIL, senha: process.env.ADMIN_PASSWORD });
  if (!result.success) throw new Error('Configure ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD válidos no .env. Senha: 8 caracteres ou mais, até 72 bytes.');
  const { nome, email, senha } = result.data;
  await pool.query("INSERT INTO usuarios (nome, email, senha_hash, papel) VALUES ($1, $2, $3, 'administrador')", [nome, email, await hashPassword(senha)]);
  console.log('Administrador criado. Faça login pela API.');
} catch (error) {
  console.error(error.code === '23505' ? 'E-mail já cadastrado. Nenhum usuário foi alterado.' : error.message);
  process.exitCode = 1;
} finally { await pool.end(); }
