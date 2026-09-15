import pool from '../config/database.js';

const fields = 'id, nome, especie, raca, idade, sexo, data_nascimento, foto, detalhes, cliente_id, data_criacao';

export const findAll = async ({ nome, usuarioId, isAdmin }) => {
  const values = [];
  const conditions = [];

  if (nome) {
    values.push(`%${nome}%`);
    conditions.push(`a.nome ILIKE $${values.length}`);
  }
  if (!isAdmin) {
    values.push(usuarioId);
    conditions.push(`EXISTS (SELECT 1 FROM clientes c WHERE c.id = a.cliente_id AND c.usuario_id = $${values.length})`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `SELECT a.${fields.replaceAll(', ', ', a.')} FROM animais a ${where} ORDER BY a.id`,
    values,
  );
  return rows;
};

export const findById = async (id) => {
  const { rows } = await pool.query(`SELECT ${fields} FROM animais WHERE id = $1`, [id]);
  return rows[0] || null;
};

export const findByIdForUser = async (id, usuarioId) => {
  const { rows } = await pool.query(
    `SELECT a.${fields.replaceAll(', ', ', a.')}
     FROM animais a
     JOIN clientes c ON c.id = a.cliente_id
     WHERE a.id = $1 AND c.usuario_id = $2`,
    [id, usuarioId],
  );
  return rows[0] || null;
};

export const create = async ({ nome, especie, raca, idade, sexo, data_nascimento, foto, detalhes, clienteId }) => {
  const { rows } = await pool.query(
    `INSERT INTO animais (nome, especie, raca, idade, sexo, data_nascimento, foto, detalhes, cliente_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING ${fields}`,
    [nome, especie, raca, idade, sexo, data_nascimento, foto, detalhes, clienteId],
  );
  return rows[0];
};

export const update = async (id, { nome, especie, raca, idade, sexo, data_nascimento, foto, detalhes, clienteId }) => {
  const { rows } = await pool.query(
    `UPDATE animais
     SET nome = $1, especie = $2, raca = $3, idade = $4, sexo = $5, data_nascimento = $6, foto = $7, detalhes = $8, cliente_id = $9
     WHERE id = $10
     RETURNING ${fields}`,
    [nome, especie, raca, idade, sexo, data_nascimento, foto, detalhes, clienteId, id],
  );
  return rows[0] || null;
};

export const remove = async (id) => {
  const { rows } = await pool.query(`DELETE FROM animais WHERE id = $1 RETURNING ${fields}`, [id]);
  return rows[0] || null;
};
