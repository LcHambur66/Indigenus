import pool from '../src/database/connection.js';
import { createInitialUsers } from '../src/services/initialUsersService.js';

try {
  const results = await createInitialUsers(pool, process.env);
  for (const { papel, criada } of results) {
    console.log(`${papel === 'administrador' ? 'Administrador' : 'Cliente'}: ${criada ? 'conta criada' : 'conta já existente, dados preservados'}.`);
  }
} catch (error) {
  console.error('Falha ao criar contas:', error.code || error.message);
  process.exitCode = 1;
} finally { await pool.end(); }
