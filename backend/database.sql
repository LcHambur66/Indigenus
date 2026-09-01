DROP TABLE IF EXISTS produtos CASCADE;

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    quantidade INTEGER NOT NULL,
    preco NUMERIC(10, 2) NOT NULL,
    imagem VARCHAR(255) NOT NULL
);

INSERT INTO
    produtos (
        nome,
        categoria,
        quantidade,
        preco,
        imagem
    )
VALUES (
        'Ração Premium para Cães',
        'Ração',
        20,
        89.90,
        'src/img/racao.jpg'
    ),
    (
        'Ração Premium para Gatos',
        'Ração',
        15,
        79.90,
        'src/img/racao-gato.jpg'
    ),
    (
        'Brinquedo Mordedor',
        'Brinquedos',
        30,
        24.90,
        'src/img/mordedor.jpg'
    ),
    (
        'Bolinha para Cachorro',
        'Brinquedos',
        25,
        19.90,
        'src/img/bolinha.jpg'
    ),
    (
        'Cama para Pet',
        'Acessórios',
        10,
        129.90,
        'src/img/cama.jpg'
    ),
    (
        'Coleira para Cachorro',
        'Acessórios',
        18,
        39.90,
        'src/img/coleira.jpg'
    ),
    (
        'Areia para Gatos',
        'Higiene',
        20,
        34.90,
        'src/img/areia-gato.jpg'
    ),
    (
        'Shampoo para Pets',
        'Higiene',
        12,
        29.90,
        'src/img/shampoo.jpg'
    );