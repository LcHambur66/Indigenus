DROP TABLE IF EXISTS animais CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  perfil VARCHAR(20) NOT NULL DEFAULT 'CLIENTE' CHECK (perfil IN ('CLIENTE', 'ADM')),
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  telefone VARCHAR(30) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE animais (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  especie VARCHAR(80) NOT NULL,
  raca VARCHAR(100),
  idade INTEGER NOT NULL CHECK (idade >= 0),
  sexo VARCHAR(20),
  data_nascimento DATE,
  foto TEXT,
  detalhes TEXT,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  quantidade INTEGER NOT NULL CHECK (quantidade >= 0),
  preco NUMERIC(12, 2) NOT NULL CHECK (preco >= 0),
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (email, senha_hash, perfil) VALUES
('admin@petshop.com', '$2a$10$pWNUQHNl47fJb.4RbNYDq.UzDRdEqL8QLR61VfmD9JR4LKtWpbm2a', 'ADM'),
('ana@petshop.com', '$2a$10$pWNUQHNl47fJb.4RbNYDq.UzDRdEqL8QLR61VfmD9JR4LKtWpbm2a', 'CLIENTE'),
('bruno@petshop.com', '$2a$10$pWNUQHNl47fJb.4RbNYDq.UzDRdEqL8QLR61VfmD9JR4LKtWpbm2a', 'CLIENTE');

INSERT INTO clientes (nome, telefone, cpf, email, usuario_id) VALUES
('Ana Souza', '(11) 99999-1111', '111.111.111-11', 'ana@petshop.com', 2),
('Bruno Lima', '(11) 99999-2222', '222.222.222-22', 'bruno@petshop.com', 3),
('Clínica Central', '(11) 99999-3333', '333.333.333-33', 'clinica@petshop.com', 1);

INSERT INTO animais (
  nome, especie, raca, idade, sexo, data_nascimento, foto, detalhes, cliente_id
) VALUES
('Rex', 'Cão', 'Labrador', 5, 'M', '2021-06-15', NULL, 'Animal dócil e brincalhão', 1),
('Rexinho', 'Cão', 'Poodle', 2, 'M', '2024-02-10', NULL, 'Precisa de passeios diários', 1),
('Mimi', 'Gato', 'Siamês', 3, 'F', '2023-04-20', NULL, 'Gosta de ambientes tranquilos', 2),
('Nina', 'Cão', 'Beagle', 7, 'F', '2019-09-05', NULL, 'Alergia a alguns tipos de ração', 3);
