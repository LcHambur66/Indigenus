# IndigenusPet

Sistema web para gerenciamento de pets e clientes de um pet shop. O projeto foi desenvolvido como trabalho final do curso de Análise e Desenvolvimento de Sistemas do SENAI.

A ideia é centralizar o cadastro de clientes e seus animais em uma única aplicação, facilitando a consulta, atualização e organização dos dados do pet shop.

## Objetivo

O IndigenusPet foi criado para resolver uma necessidade comum de pequenos pet shops: controlar clientes, animais e informações importantes sem depender de planilhas ou registros separados.

O sistema possui dois perfis principais:

- **Cliente:** acessa seu cadastro e seus animais.
- **Administrador:** gerencia clientes e animais cadastrados.

## Funcionalidades

- Cadastro e login de usuários.
- Autenticação com token JWT.
- Controle de acesso por perfil (`CLIENTE` e `ADM`).
- Cadastro de clientes com nome, CPF, telefone e e-mail.
- Cadastro de animais com nome, espécie, raça, idade, sexo e detalhes.
- Listagem de clientes e animais para administradores.
- Consulta e atualização de animais.
- Validação de propriedade: clientes só podem acessar seus próprios dados e animais.
- Banco de dados relacional com PostgreSQL.
- Interface web responsiva construída em React.

## Arquitetura

O projeto utiliza uma arquitetura separada em frontend e backend:

```text
Usuário
	|
	v
Frontend React + Vite
	|  Fetch / JSON / JWT
	v
API REST Node.js + Express
	|
	v
Camada de controllers e models
	|
	v
PostgreSQL
```

### Frontend

O frontend é uma Single Page Application desenvolvida com React. O `react-router-dom` controla a navegação entre páginas e um helper centralizado organiza as requisições para a API.

As rotas protegidas verificam o token salvo no `localStorage` e o perfil do usuário antes de exibir dashboards e áreas administrativas.

### Backend

O backend é uma API REST construída com Node.js e Express, seguindo uma organização inspirada em MVC:

- **Routes:** definem os endpoints da API.
- **Controllers:** validam as requisições e coordenam as operações.
- **Models:** executam as consultas SQL no PostgreSQL.
- **Middlewares:** validam JWT e permissões administrativas.
- **Config:** cria o pool de conexão e inicializa as tabelas necessárias.

### Banco de dados

O PostgreSQL armazena as entidades principais:

- `usuarios`: credenciais, perfil e data de criação.
- `clientes`: dados do cliente relacionados a um usuário.
- `animais`: pets relacionados a um cliente.
- `produtos`: estrutura preparada para uma futura expansão do sistema.

As relações principais são:

```text
usuarios 1 ---- N clientes 1 ---- N animais
```

## Estrutura do projeto

```text
Indigenus/
├── README.md
├── Backend/
│   ├── package.json
│   ├── .env
│   ├── database/
│   │   └── database.sql
│   └── src/
│       ├── server.js
│       ├── config/
│       │   └── database.js
│       ├── controllers/
│       │   ├── animalController.js
│       │   ├── authController.js
│       │   └── clienteController.js
│       ├── middlewares/
│       │   └── authMiddleware.js
│       ├── models/
│       │   ├── animalModel.js
│       │   ├── clienteModel.js
│       │   └── usuarioModel.js
│       └── routes/
│           ├── animalRoutes.js
│           ├── authRoutes.js
│           └── clienteRoutes.js
└── frontend/
	 ├── package.json
	 ├── vite.config.js
	 └── src/
		  ├── App.jsx
		  ├── main.jsx
		  ├── services/api.js
		  ├── components/
		  └── pages/
```

## Rotas do frontend

| Rota | Finalidade | Acesso |
| --- | --- | --- |
| `/` | Página inicial | Público |
| `/login` | Login | Público |
| `/register` | Cadastro de usuário e cliente | Público |
| `/contato` | Formulário de contato | Público |
| `/dashboard/adm` | Dashboard administrativo | Administrador |
| `/dashboard/cliente` | Área do cliente | Cliente |
| `/animais` | Listagem de animais | Administrador |
| `/clientes` | Listagem de clientes | Administrador |
| `/animais/cadastro` | Cadastro de animal | Usuário autenticado |
| `/animais/:id` | Detalhes de um animal | Usuário autenticado |
| `/animais/:id/editar` | Atualização de animal | Usuário autenticado |

## Endpoints da API

Todas as rotas abaixo, exceto autenticação, exigem o cabeçalho:

```http
Authorization: Bearer <token>
```

### Autenticação

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/auth/register` | Cria um usuário |
| `POST` | `/auth/login` | Autentica um usuário e retorna JWT |

### Clientes

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/clientes` | Lista clientes conforme o perfil |
| `GET` | `/clientes/me` | Retorna o cliente do usuário autenticado |
| `POST` | `/clientes` | Cria um cliente |
| `GET` | `/clientes/:id` | Busca um cliente |
| `PUT` | `/clientes/:id` | Atualiza um cliente |
| `PUT` | `/clientes/me` | Atualiza o próprio perfil |
| `DELETE` | `/clientes/:id` | Exclui um cliente; somente administrador |

### Animais

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/animais` | Lista animais do usuário ou todos, para administrador |
| `GET` | `/animais/:id` | Busca um animal |
| `POST` | `/animais` | Cadastra um animal |
| `PUT` | `/animais/:id` | Atualiza um animal |
| `DELETE` | `/animais/:id` | Remove um animal |

### Status

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/status` | Informa o estado da API e do banco |

## Tecnologias utilizadas

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Fetch API
- Oxlint

### Backend

- Node.js
- Express
- PostgreSQL
- `pg` para acesso ao banco
- JWT para autenticação
- `bcryptjs` para hash de senhas
- CORS
- Dotenv

## Como executar

### Pré-requisitos

- Node.js instalado.
- PostgreSQL instalado e em execução.
- Um banco chamado `petshop` criado no PostgreSQL.

### Configurar o backend

Crie ou ajuste o arquivo `Backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=petshop
JWT_SECRET=uma_chave_secreta_forte
PORT=3000
```

Depois, instale as dependências e inicie a API:

```bash
cd Backend
npm install
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

O arquivo `Backend/database/database.sql` contém a estrutura e dados iniciais. O backend também cria as tabelas necessárias ao iniciar, caso elas ainda não existam.

### Configurar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend será disponibilizado pela URL exibida pelo Vite, normalmente `http://localhost:5173`.

Caso a API esteja em outra URL, crie `frontend/.env` com:

```env
VITE_API_URL=http://localhost:3000
```

## Scripts disponíveis

### Frontend

```bash
npm run dev      # inicia o ambiente de desenvolvimento
npm run build    # gera a versão de produção
npm run lint     # verifica problemas estáticos
npm run preview  # visualiza o build de produção
```

### Backend

```bash
npm run dev      # inicia com Nodemon
npm start        # inicia a API normalmente
```

## Segurança e regras de acesso

- Senhas não são armazenadas em texto puro; são protegidas com bcrypt.
- O login gera um JWT com o identificador, e-mail e perfil do usuário.
- Rotas privadas recusam requisições sem token válido.
- Operações administrativas verificam o perfil `ADM`.
- Clientes não podem consultar ou alterar dados pertencentes a outros usuários.

## Estado atual e próximos passos

O núcleo de autenticação, clientes, animais e permissões está estruturado. Algumas telas ainda podem evoluir visualmente e o cadastro de foto atualmente mantém a prévia no frontend, pois o endpoint atual trabalha com JSON e não possui upload de arquivos.

Como evoluções futuras, o projeto pode receber gerenciamento de produtos, agendamentos, atendimentos, persistência de imagens e um dashboard com indicadores reais.

## Contexto acadêmico

Projeto desenvolvido como trabalho final do curso de Análise e Desenvolvimento de Sistemas do SENAI, aplicando conceitos de desenvolvimento web, APIs REST, banco de dados relacional, autenticação, autorização e organização de software em camadas.
