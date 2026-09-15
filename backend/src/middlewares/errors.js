export class ApiError extends Error {
  constructor(status, mensagem) { super(mensagem); this.status = status; }
}
// Express 4 exige encaminhar rejeições assíncronas ao middleware de erros.
export const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.type === 'entity.parse.failed') return res.status(400).json({ mensagem: 'JSON inválido.' });
  if (error.type === 'entity.too.large') return res.status(413).json({ mensagem: 'Corpo da requisição muito grande.' });
  if (error.code === '23505') return res.status(409).json({ mensagem: 'Já existe um registro com esses dados.' });
  if (['23503', '23001'].includes(error.code)) return res.status(409).json({ mensagem: 'Recurso relacionado inexistente ou ainda utilizado por produtos.' });
  if (['23514', '23502', '22003', '22P02'].includes(error.code)) return res.status(400).json({ mensagem: 'Dados incompatíveis com o banco de dados.' });
  if (error instanceof ApiError) return res.status(error.status).json({ mensagem: error.message });
  console.error('Erro interno:', error.code || error.name);
  return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
}
