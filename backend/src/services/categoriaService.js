import { ApiError } from '../middlewares/errors.js';

export function categoriaService(db) {
  return {
    async listar() { return (await db.query('SELECT * FROM categorias ORDER BY id')).rows; },
    async buscar(id) {
      const { rows } = await db.query('SELECT * FROM categorias WHERE id = $1', [id]);
      if (!rows[0]) throw new ApiError(404, 'Categoria não encontrada.');
      return rows[0];
    },
    async criar({ nome, descricao }) {
      return (await db.query('INSERT INTO categorias (nome, descricao) VALUES ($1, $2) RETURNING *', [nome, descricao])).rows[0];
    },
    async atualizar(id, { nome, descricao }) {
      const { rows } = await db.query('UPDATE categorias SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *', [nome, descricao, id]);
      if (!rows[0]) throw new ApiError(404, 'Categoria não encontrada.');
      return rows[0];
    },
    async excluir(id) {
      const { rowCount } = await db.query('DELETE FROM categorias WHERE id = $1', [id]);
      if (!rowCount) throw new ApiError(404, 'Categoria não encontrada.');
    },
  };
}
