import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)), quiet: true });

export function getConfig() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 32) throw new Error('Configure JWT_SECRET no backend/.env com pelo menos 32 caracteres.');
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT inválida.');
  return { jwtSecret, port, origins: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(value => value.trim()) };
}
