# API REST de PetShop

Backend em Node.js, Express e PostgreSQL, organizado em MVC, com JWT,
bcryptjs, CORS e regras de autorização para clientes e administradores.

## Estrutura

```text
src/
├── config/database.js
├── controllers/
├── middlewares/authMiddleware.js
├── models/
├── routes/
└── server.js
database/database.sql
```

## Configuração

1. Instale Node.js e PostgreSQL.
2. Crie o banco `petshop`.
3. Copie `.env.example` para `.env` e informe a senha do PostgreSQL e um
   `JWT_SECRET` forte.
4. Execute `database/database.sql` no banco criado (ou execute `database.sql`
   com `psql`).
5. Instale e inicie:

```bash
npm install
npm run dev
```

O servidor fica em `http://localhost:3000`.

Os usuários de teste usam a senha `password`:

- `admin@petshop.com` (ADM)
- `ana@petshop.com` (CLIENTE)
- `bruno@petshop.com` (CLIENTE)

## Endpoints

Todas as rotas, exceto autenticação, exigem
`Authorization: Bearer <token>`.

| Método | Endpoint | Permissão |
| --- | --- | --- |
| POST | `/auth/register` | Público |
| POST | `/auth/login` | Público |
| GET | `/clientes` | ADM lista todos; CLIENTE vê o seu |
| GET | `/clientes/me` | Usuário autenticado |
| PUT | `/clientes/me` | Usuário autenticado |
| GET | `/clientes/:id` | ADM ou dono |
| POST | `/clientes` | ADM |
| PUT | `/clientes/:id` | ADM ou dono |
| DELETE | `/clientes/:id` | ADM |
| GET | `/animais` | Usuário autenticado; `?nome=Rex` é parcial |
| GET | `/animais/:id` | ADM ou dono |
| POST | `/animais` | ADM ou dono do cliente |
| PUT | `/animais/:id` | ADM ou dono |
| DELETE | `/animais/:id` | ADM ou dono |
| GET | `/produtos` | Usuário autenticado |
| GET | `/produtos/:id` | Usuário autenticado |
| POST | `/produtos` | ADM |
| PUT | `/produtos/:id` | ADM |
| DELETE | `/produtos/:id` | ADM |

## Exemplos

```json
POST /auth/register
{ "email": "novo@petshop.com", "senha": "segura123" }
```

```json
POST /auth/login
{ "email": "ana@petshop.com", "senha": "password" }
```

```json
POST /animais
{
  "nome": "Rex Junior",
  "especie": "Cão",
  "raca": "Vira-lata",
  "idade": 1,
  "sexo": "M",
  "cliente_id": 1
}
```

Senhas são armazenadas somente como hashes bcrypt. O perfil e o `usuario_id`
não podem ser alterados por clientes, e todas as consultas de clientes e
animais verificam a propriedade no backend.
