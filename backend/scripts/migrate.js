import pool from '../src/database/connection.js';
import { migrate } from '../src/database/migrate.js';

try {
  await migrate(pool);
  console.log('Banco atualizado com sucesso.');
} catch (error) {
  console.error('Falha na migração:', error.code || error.message);
  process.exitCode = 1;
} finally { await pool.end(); }
