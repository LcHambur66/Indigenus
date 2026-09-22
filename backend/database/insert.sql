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



-- Conta Admin Inicial
INSERT INTO usuarios (email, senha_hash, perfil)
VALUES ('admin@gmail.com', '$2a$10$8mbwLlGMAsorHSIJpYssXedH5FPJwcjHAoa7RAwjhjciDDyGyMabe', 'ADM')
ON CONFLICT (email) DO UPDATE
SET senha_hash = EXCLUDED.senha_hash,
    perfil = EXCLUDED.perfil;