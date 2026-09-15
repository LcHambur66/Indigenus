import pool from '../config/database.js';

export const findByEmail = async (email) => {
  const { rows } = await pool.query(
    'SELECT id, email, senha_hash, perfil, data_criacao FROM usuarios WHERE email = $1',
    [email],
  );
  return rows[0] || null;
};

export const create = async (email, senhaHash, perfil = 'CLIENTE') => {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (email, senha_hash, perfil)
     VALUES ($1, $2, $3)
     RETURNING id, email, perfil, data_criacao`,
    [email, senhaHash, perfil],
  );
  return rows[0];
};

export const findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, email, perfil, data_criacao FROM usuarios WHERE id = $1',
    [id],
  );
  return rows[0] || null;
};
