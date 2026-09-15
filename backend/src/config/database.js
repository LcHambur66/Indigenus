import pg from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = pg;
const dbPassword = process.env.DB_PASSWORD;

if (typeof dbPassword !== 'string') {
  throw new Error('DB_PASSWORD não definida ou inválida. Verifique o arquivo backend/.env.');
}

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: dbPassword,
  database: process.env.DB_NAME,
});

export const initializeDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        senha_hash VARCHAR(255) NOT NULL,
        perfil VARCHAR(20) NOT NULL DEFAULT 'CLIENTE' CHECK (perfil IN ('CLIENTE', 'ADM')),
        data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        telefone VARCHAR(30) NOT NULL,
        cpf VARCHAR(14) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS animais (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        especie VARCHAR(80) NOT NULL,
        raca VARCHAR(100),
        idade INTEGER NOT NULL CHECK (idade >= 0),
        sexo VARCHAR(20),
        data_nascimento DATE,
        foto TEXT,
        detalhes TEXT,
        cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
        data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        categoria VARCHAR(100) NOT NULL,
        quantidade INTEGER NOT NULL CHECK (quantidade >= 0),
        preco NUMERIC(12, 2) NOT NULL CHECK (preco >= 0),
        data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      ALTER TABLE animais
      ADD COLUMN IF NOT EXISTS detalhes TEXT
    `);

    await client.query(`
      ALTER TABLE animais
      ADD COLUMN IF NOT EXISTS data_nascimento DATE,
      ADD COLUMN IF NOT EXISTS foto TEXT
    `);

    await client.query('COMMIT');
    console.log('Banco de dados inicializado.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export default pool;
