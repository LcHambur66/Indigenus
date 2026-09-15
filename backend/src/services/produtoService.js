import { ApiError } from '../middlewares/errors.js';

const select = 'SELECT p.*, c.nome AS categoria FROM produtos p JOIN categorias c ON c.id = p.categoria_id';
// pg retorna NUMERIC como string; o contrato HTTP usa número para preço.
const serialize = produto => ({ ...produto, preco: Number(produto.preco) });

export function produtoService(db) {
  async function buscar(id) {
    const { rows } = await db.query(`${select} WHERE p.id = $1`, [id]);
    if (!rows[0]) throw new ApiError(404, 'Produto não encontrado.');
    return serialize(rows[0]);
  }
  async function categoriaId(dados) {
    const { rows } = dados.categoria_id
      ? await db.query('SELECT id FROM categorias WHERE id = $1', [dados.categoria_id])
      : await db.query('SELECT id FROM categorias WHERE LOWER(nome) = LOWER($1)', [dados.categoria]);
    if (!rows[0]) throw new ApiError(400, 'Categoria inexistente. Cadastre a categoria primeiro.');
    return rows[0].id;
  }
  return {
    buscar,
    async listar() {
      const { rows } = await db.query(`${select} ORDER BY p.id`);
      return rows.map(serialize);
    },
    async criar(dados) {
      const categoria = await categoriaId(dados);
      const { rows } = await db.query('INSERT INTO produtos (nome, categoria_id, quantidade, preco, descricao, imagem) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [dados.nome, categoria, dados.quantidade, dados.preco, dados.descricao || '', dados.imagem || '']);
      return buscar(rows[0].id);
    },
    async atualizar(id, dados) {
      await buscar(id);
      const categoria = await categoriaId(dados);
      const { rowCount } = await db.query('UPDATE produtos SET nome = $1, categoria_id = $2, quantidade = $3, preco = $4, descricao = COALESCE($5, descricao), imagem = COALESCE($6, imagem) WHERE id = $7', [dados.nome, categoria, dados.quantidade, dados.preco, dados.descricao ?? null, dados.imagem ?? null, id]);
      if (!rowCount) throw new ApiError(404, 'Produto não encontrado.');
      return buscar(id);
    },
    async excluir(id) {
      const { rowCount } = await db.query('DELETE FROM produtos WHERE id = $1', [id]);
      if (!rowCount) throw new ApiError(404, 'Produto não encontrado.');
    },
  };
}
