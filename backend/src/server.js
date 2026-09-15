import pool from './database/connection.js';
import { getConfig } from './config.js';
import { createApp } from './app.js';

try {
  const config = getConfig();
  await pool.query('SELECT 1 FROM usuarios LIMIT 1');
  const server = createApp({ db: pool, config }).listen(config.port, () => {
    console.log(`Indigenus API: http://localhost:${config.port}/api`);
  });
  server.on('error', async error => {
    console.error('Não foi possível iniciar o servidor:', error.code);
    await pool.end();
    process.exitCode = 1;
  });
  const shutdown = () => {
    const timeout = setTimeout(() => process.exit(1), 10000);
    timeout.unref();
    server.close(async () => { await pool.end(); clearTimeout(timeout); });
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
} catch (error) {
  console.error('Falha na inicialização. Confira backend/.env, PostgreSQL e npm run db:migrate.', error.code || error.message);
  await pool.end();
  process.exitCode = 1;
}
