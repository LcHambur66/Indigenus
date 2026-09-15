import { z } from 'zod';

const nome = z.string().trim().min(2, 'Informe pelo menos 2 caracteres.').max(100);
const email = z.string().trim().toLowerCase().email('E-mail inválido.').max(254);
const senha = z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.').refine(value => Buffer.byteLength(value, 'utf8') <= 72, 'A senha deve ter no máximo 72 bytes.');
const id = z.number().int().positive().max(2147483647);
export const cadastroSchema = z.object({ nome, email, senha }).strict();
export const loginSchema = z.object({ email, senha: z.string().min(1).refine(value => Buffer.byteLength(value, 'utf8') <= 72, 'A senha deve ter no máximo 72 bytes.') }).strict();
export const perfilSchema = z.object({ nome, email }).strict();
export const categoriaSchema = z.object({ nome, descricao: z.string().trim().max(2000).default('') }).strict();
export const produtoSchema = z.object({
  nome,
  categoria_id: id.optional(),
  categoria: nome.optional(),
  descricao: z.string().trim().max(2000).optional(),
  quantidade: z.number().int().min(0, 'A quantidade não pode ser negativa.').max(2147483647),
  preco: z.number().positive('O preço deve ser maior que zero.').max(99999999.99).refine(value => Math.abs(value * 100 - Math.round(value * 100)) < 0.00001, 'Use no máximo duas casas decimais.'),
  imagem: z.string().max(255).refine(value => value === '' || /^\/imagens\/[a-zA-Z0-9._-]+$/.test(value) || /^https?:\/\//.test(value) && URL.canParse(value), 'Use uma URL http(s) ou /imagens/arquivo.jpg.').optional(),
}).strict().refine(value => Boolean(value.categoria_id) !== Boolean(value.categoria), 'Informe categoria_id ou categoria, apenas um deles.');

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ mensagem: 'Dados inválidos.', erros: result.error.issues.map(issue => ({ campo: issue.path.join('.'), mensagem: issue.message })) });
    req.body = result.data;
    next();
  };
}
export function validateId(req, res, next) {
  if (!/^[1-9]\d*$/.test(req.params.id) || !id.safeParse(Number(req.params.id)).success) return res.status(400).json({ mensagem: 'ID deve ser um inteiro positivo válido.' });
  next();
}
