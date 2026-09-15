import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as usuarioModel from '../models/usuarioModel.js';

const publicUser = ({ id, email, perfil, data_criacao }) => ({ id, email, perfil, data_criacao });

export const register = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !senha || senha.length < 6) {
      return res.status(400).json({ mensagem: 'Email válido e senha com pelo menos 6 caracteres são obrigatórios' });
    }
    if (await usuarioModel.findByEmail(email.trim().toLowerCase())) {
      return res.status(409).json({ mensagem: 'Email já cadastrado' });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await usuarioModel.create(email.trim().toLowerCase(), senhaHash);
    return res.status(201).json({ usuario: publicUser(usuario) });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    if (error.code === '23505') return res.status(409).json({ mensagem: 'Email já cadastrado' });
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
    const usuario = await usuarioModel.findByEmail(email.trim().toLowerCase());
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha_hash))) {
      return res.status(401).json({ mensagem: 'Email ou senha inválidos' });
    }
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET não configurado');
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, perfil: usuario.perfil },
      process.env.JWT_SECRET,
      { expiresIn: '8h' },
    );
    return res.status(200).json({ token, usuario: publicUser(usuario) });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};
