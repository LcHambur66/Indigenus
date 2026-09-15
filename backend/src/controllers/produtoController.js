import pool from '../database/connection.js';

const idFrom = (value) => /^\d+$/.test(value) ? Number(value) : null;
const validate = ({ nome, categoria, quantidade, preco }) =>
  typeof nome === 'string' &&
  nome.trim().length > 0 &&
  typeof categoria === 'string' &&
  categoria.trim().length > 0 &&
  Number.isInteger(quantidade) &&
  quantidade >= 0 &&
  typeof preco === 'number' &&
  Number.isFinite(preco) &&
  preco >= 0;

// GET /produtos - Listar todos os produtos
export const listarProdutos = async (req, res) => {
  try {
    const query = 'SELECT * FROM produtos ORDER BY id;';
    const { rows } = await pool.query(query);

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

// GET /produtos/:id - Buscar produto por ID
export const buscarProdutoPorId = async (req, res) => {
  try {
    const id = idFrom(req.params.id);
    if (!id) return res.status(400).json({ mensagem: 'ID inválido' });
    const query = 'SELECT * FROM produtos WHERE id = $1;';
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

// POST /produtos - Cadastrar novo produto
export const criarProduto = async (req, res) => {
  try {
    const { nome, categoria, quantidade, preco } = req.body;
    if (!validate(req.body)) {
      return res.status(400).json({ mensagem: 'Nome, categoria, quantidade e preço válidos são obrigatórios' });
    }

    const query = `
      INSERT INTO produtos (nome, categoria, quantidade, preco)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [nome, categoria, quantidade, preco];

    const { rows } = await pool.query(query, values);

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

// PUT /produtos/:id - Atualizar produto existente
export const atualizarProduto = async (req, res) => {
  try {
    const id = idFrom(req.params.id);
    if (!id) return res.status(400).json({ mensagem: 'ID inválido' });
    const { nome, categoria, quantidade, preco } = req.body;
    if (!validate(req.body)) {
      return res.status(400).json({ mensagem: 'Nome, categoria, quantidade e preço válidos são obrigatórios' });
    }

    const query = `
      UPDATE produtos
      SET nome = $1, categoria = $2, quantidade = $3, preco = $4
      WHERE id = $5
      RETURNING *;
    `;
    const values = [nome, categoria, quantidade, preco, id];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

// DELETE /produtos/:id - Excluir produto
export const deletarProduto = async (req, res) => {
  try {
    const id = idFrom(req.params.id);
    if (!id) return res.status(400).json({ mensagem: 'ID inválido' });

    const query = 'DELETE FROM produtos WHERE id = $1 RETURNING *;';
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};
