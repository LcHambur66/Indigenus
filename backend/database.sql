-- Migração idempotente: preserva produtos da estrutura original.
-- Execute com npm run db:migrate para aplicar em uma transação.
-- Salvar este arquivo não atualiza automaticamente o banco conectado.
-- Tipos de conta da aplicação (ambos na tabela usuarios):
--   usuario       = cliente: consulta produtos/categorias e edita o próprio perfil.
--   administrador = adm: também cadastra, edita e exclui produtos/categorias.
-- npm run users:create cria as contas ADMIN_* e CLIENT_* configuradas no .env.
-- O cadastro público da API também permite criar clientes.
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  papel VARCHAR(20) NOT NULL DEFAULT 'usuario' CHECK (papel IN ('usuario', 'administrador')),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS sessoes (
  id UUID PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  expira_em TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS sessoes_expiracao_idx ON sessoes(expira_em);
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS categorias_nome_unico ON categorias (LOWER(nome));
CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
  descricao TEXT NOT NULL DEFAULT '',
  quantidade INTEGER NOT NULL CHECK (quantidade >= 0),
  preco NUMERIC(10,2) NOT NULL CHECK (preco > 0),
  imagem VARCHAR(255) NOT NULL DEFAULT '',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS categoria_id INTEGER REFERENCES categorias(id) ON DELETE RESTRICT;
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS descricao TEXT NOT NULL DEFAULT '';
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE produtos ALTER COLUMN imagem SET DEFAULT '';
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'produtos' AND column_name = 'categoria') THEN
    INSERT INTO categorias (nome) SELECT DISTINCT TRIM(categoria) FROM produtos ON CONFLICT DO NOTHING;
    UPDATE produtos p SET categoria_id = c.id FROM categorias c WHERE LOWER(c.nome) = LOWER(TRIM(p.categoria)) AND p.categoria_id IS NULL;
    ALTER TABLE produtos DROP COLUMN categoria;
  END IF;
END $$;
ALTER TABLE produtos ALTER COLUMN categoria_id SET NOT NULL;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'produtos_valores_validos' AND conrelid = 'produtos'::regclass) THEN
    ALTER TABLE produtos ADD CONSTRAINT produtos_valores_validos CHECK (quantidade >= 0 AND preco > 0);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS produtos_categoria_idx ON produtos(categoria_id);
