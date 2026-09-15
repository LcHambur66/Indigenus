import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Token de autenticação não informado' });
  }

  const token = header.slice(7);
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não configurado');
    }
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    console.error('Erro ao validar token:', error.message);
    return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.perfil !== 'ADM') {
    return res.status(403).json({ mensagem: 'Acesso permitido apenas para administradores' });
  }
  return next();
};
