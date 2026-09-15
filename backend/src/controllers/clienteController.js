import * as clienteModel from '../models/clienteModel.js';

const idFrom = (value) => /^\d+$/.test(value) ? Number(value) : null;
const validate = (body) => {
  const { nome, telefone, cpf, email } = body;
  if (!nome || !telefone || !cpf || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  return true;
};

export const listar = async (req, res) => {
  try {
    const cliente = req.user.perfil === 'ADM' ? null : await clienteModel.findByUserId(req.user.id);
    const clientes = req.user.perfil === 'ADM' ? await clienteModel.findAll() : (cliente ? [cliente] : []);
    return res.status(200).json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const id = idFrom(req.params.id);
    if (!id) return res.status(400).json({ mensagem: 'ID inválido' });
    const cliente = await clienteModel.findById(id);
    if (!cliente) return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    if (req.user.perfil !== 'ADM' && cliente.usuario_id !== req.user.id) {
      return res.status(403).json({ mensagem: 'Você não tem permissão para acessar este cliente' });
    }
    return res.status(200).json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

export const meuPerfil = async (req, res) => {
  try {
    const cliente = await clienteModel.findByUserId(req.user.id);
    if (!cliente) return res.status(404).json({ mensagem: 'Perfil de cliente não encontrado' });
    return res.status(200).json(cliente);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

export const criar = async (req, res) => {
  try {
    if (!validate(req.body)) return res.status(400).json({ mensagem: 'Nome, telefone, CPF e email válido são obrigatórios' });
    const usuarioId = req.user.perfil === 'ADM' ? req.body.usuario_id : req.user.id;
    if (!Number.isInteger(usuarioId)) return res.status(400).json({ mensagem: 'usuario_id é obrigatório e deve ser numérico' });
    if (req.user.perfil !== 'ADM' && await clienteModel.findByUserId(req.user.id)) {
      return res.status(409).json({ mensagem: 'Este usuário já possui um cliente cadastrado' });
    }
    const cliente = await clienteModel.create({ ...req.body, usuarioId });
    return res.status(201).json(cliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    if (error.code === '23505') return res.status(409).json({ mensagem: 'CPF ou email já cadastrado' });
    if (error.code === '23503') return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

export const atualizar = async (req, res) => {
  try {
    const id = idFrom(req.params.id);
    if (!id) return res.status(400).json({ mensagem: 'ID inválido' });
    const atual = await clienteModel.findById(id);
    if (!atual) return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    if (req.user.perfil !== 'ADM' && atual.usuario_id !== req.user.id) return res.status(403).json({ mensagem: 'Sem permissão' });
    if (!validate(req.body)) return res.status(400).json({ mensagem: 'Nome, telefone, CPF e email válido são obrigatórios' });
    return res.status(200).json(await clienteModel.update(id, req.body));
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    if (error.code === '23505') return res.status(409).json({ mensagem: 'CPF ou email já cadastrado' });
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

export const atualizarMeuPerfil = async (req, res) => {
  try {
    const cliente = await clienteModel.findByUserId(req.user.id);
    if (!cliente) return res.status(404).json({ mensagem: 'Perfil de cliente não encontrado' });
    if (!validate(req.body)) return res.status(400).json({ mensagem: 'Nome, telefone, CPF e email válido são obrigatórios' });
    return res.status(200).json(await clienteModel.update(cliente.id, req.body));
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    if (error.code === '23505') return res.status(409).json({ mensagem: 'CPF ou email já cadastrado' });
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

export const remover = async (req, res) => {
  try {
    const id = idFrom(req.params.id);
    if (!id) return res.status(400).json({ mensagem: 'ID inválido' });
    const atual = await clienteModel.findById(id);
    if (!atual) return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    if (req.user.perfil !== 'ADM') return res.status(403).json({ mensagem: 'Apenas administradores podem excluir clientes' });
    await clienteModel.remove(id);
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao remover cliente:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};
