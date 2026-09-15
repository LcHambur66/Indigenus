import pool from '../config/database.js';

const fields = 'id, nome, telefone, cpf, email, usuario_id, data_criacao';

export const findAll = async () => {
  const { rows } = await pool.query(`SELECT ${fields} FROM clientes ORDER BY id`);
  return rows;
};

export const findById = async (id) => {
  const { rows } = await pool.query(`SELECT ${fields} FROM clientes WHERE id = $1`, [id]);
  return rows[0] || null;
};

export const findByUserId = async (usuarioId) => {
  const { rows } = await pool.query(
    `SELECT ${fields} FROM clientes WHERE usuario_id = $1 ORDER BY id LIMIT 1`,
    [usuarioId],
  );
  return rows[0] || null;
};

export const belongsToUser = async (clienteId, usuarioId) => {
  const { rows } = await pool.query(
    'SELECT 1 FROM clientes WHERE id = $1 AND usuario_id = $2',
    [clienteId, usuarioId],
  );
  return rows.length > 0;
};

export const create = async ({ nome, telefone, cpf, email, usuarioId }) => {
  const { rows } = await pool.query(
    `INSERT INTO clientes (nome, telefone, cpf, email, usuario_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${fields}`,
    [nome, telefone, cpf, email, usuarioId],
  );
  return rows[0];
};

export const update = async (id, { nome, telefone, cpf, email }) => {
  const { rows } = await pool.query(
    `UPDATE clientes
     SET nome = $1, telefone = $2, cpf = $3, email = $4
     WHERE id = $5
     RETURNING ${fields}`,
    [nome, telefone, cpf, email, id],
  );
  return rows[0] || null;
};

export const remove = async (id) => {
  const { rows } = await pool.query(`DELETE FROM clientes WHERE id = $1 RETURNING ${fields}`, [id]);
  return rows[0] || null;
};
