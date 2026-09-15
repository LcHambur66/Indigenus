# Indigenus — Backend de estoque pet

API REST de produtos e categorias para uma loja de produtos pet, seguindo o tema que já existia neste repositório. Implementação somente do backend.

**Integrantes:** preencher com os nomes da equipe.

## Funcionalidades

- Cadastro, login com JWT (uma hora), logout que revoga a sessão no banco e edição do próprio perfil.
- Dois níveis: usuário consulta; administrador cadastra, edita e exclui produtos e categorias.
- CRUD completo de produtos: nome, categoria, quantidade, preço, descrição e imagem.
- CRUD de categorias com relacionamento por chave estrangeira e bloqueio de exclusão enquanto houver produtos.
- Senhas com bcrypt, consultas SQL parametrizadas, validação Zod, erros em JSON, CORS configurável e limite de tentativas no login/cadastro.
- Imagens existentes servidas em `/imagens`. Não há upload de arquivos.
- Migração que preserva produtos do esquema antigo, documentação OpenAPI e testes de integração.

## Tecnologias

Node.js 22 ou superior, Express 4, PostgreSQL, node-postgres (`pg`), Zod, bcryptjs, jsonwebtoken, Helmet e express-rate-limit. Testes com `node:test`, Supertest e PGlite.

## Instalação e execução

Na pasta do projeto:

```powershell
cd backend
npm ci
if (!(Test-Path .env)) { Copy-Item .env.example .env }
```

Configure o arquivo `.env`:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: conexão PostgreSQL.
- Alternativamente, `DATABASE_URL`: string de conexão; tem prioridade sobre `DB_*`. Para hospedagem, use os parâmetros TLS e certificados exigidos pelo provedor.
- `JWT_SECRET`: chave aleatória com pelo menos 32 caracteres. Gere com o comando abaixo e copie o resultado para `.env`.
- `CORS_ORIGIN`: origem do frontend, por padrão `http://localhost:5173`. Aceita várias origens separadas por vírgula.
- `PORT`: porta HTTP; padrão `3000`.
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`: dados do primeiro administrador. Escolha uma senha de pelo menos 8 caracteres e até 72 bytes UTF-8.
- `CLIENT_NAME`, `CLIENT_EMAIL`, `CLIENT_PASSWORD`: dados da conta cliente, com a mesma regra de senha. Use um e-mail diferente do administrador.

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Instale/inicie o PostgreSQL e crie um banco vazio pelo pgAdmin ou pelo `psql`:

```sql
CREATE DATABASE indigenus;
```

Com o `.env` configurado:

```powershell
npm run db:migrate
npm run users:create
npm run dev
```

Para executar sem monitoramento de arquivos: `npm start`.

O script `users:create` lê `ADMIN_*` e `CLIENT_*` do `.env` e cria as duas contas no banco, com senhas armazenadas como hash bcrypt. Você pode repetir o comando: contas com o mesmo e-mail e papel são preservadas. Se um e-mail pertencer ao outro tipo de conta, a operação inteira é revertida. Alterar o `.env` depois da criação não redefine a senha nem o perfil de uma conta existente.

O login das duas contas é feito em `POST /api/auth/login`, enviando o e-mail e a senha correspondentes. O cadastro público continua criando clientes e rejeita o campo `papel`. O comando `npm run admin:create` também continua disponível para criar somente um administrador.

O banco novo começa sem produtos ou categorias. Cadastre uma categoria antes do primeiro produto. A inicialização verifica a conexão e a tabela de usuários; a migração é executada explicitamente pelo comando acima.

## Banco de dados

Os dois tipos de conta ficam na mesma tabela `usuarios`: `papel = 'usuario'` identifica o **cliente**, e `papel = 'administrador'` identifica o **adm**. São permissões da aplicação, não usuários de conexão do PostgreSQL. O SQL cria a estrutura; `npm run users:create` cria as duas contas configuradas no `.env`. O cadastro da API também cria clientes.

Editar `database.sql` não altera automaticamente o banco em uso. Para aplicar a estrutura desse arquivo, configure a conexão no `.env` e execute `npm run db:migrate`. Sem essa execução, o banco continua com a estrutura anterior.

O script [database.sql](database.sql) contém a estrutura e a atualização do esquema original. `npm run db:migrate` executa tudo em uma transação e pode ser repetido. Ele transforma a antiga categoria textual em `categoria_id`, mantém IDs, preços, quantidades e caminhos de imagens existentes, e acrescenta descrição e data de criação. Dados antigos com preço não positivo ou estoque negativo fazem a migração falhar e reverter, para que sejam corrigidos antes de uma nova tentativa.

| Tabela | Campos principais | Relacionamentos |
| --- | --- | --- |
| usuarios | id (PK), nome, email único, senha_hash, papel, criado_em | Um usuário tem várias sessões |
| sessoes | id UUID (PK / identificador do JWT), usuario_id, expira_em | FK para usuarios, exclusão em cascata |
| categorias | id (PK), nome único sem diferenciar maiúsculas, descricao, criado_em | Uma categoria tem vários produtos |
| produtos | id (PK), nome, categoria_id, quantidade, preco, descricao, imagem, criado_em | FK para categorias, exclusão restrita |

Sessões expiradas são removidas durante novos logins. Cada requisição autenticada confere a assinatura do token, a sessão e o papel atual do usuário no banco. Logout encerra somente a sessão que enviou a requisição.

## Links e endpoints

Estes endereços funcionam **depois de iniciar o backend localmente**:

- Base: `http://localhost:3000/api`
- Saúde do banco: [http://localhost:3000/api/health](http://localhost:3000/api/health)
- Contrato OpenAPI: [http://localhost:3000/api/openapi.json](http://localhost:3000/api/openapi.json)
- Produtos: [http://localhost:3000/api/produtos](http://localhost:3000/api/produtos)
- Categorias: [http://localhost:3000/api/categorias](http://localhost:3000/api/categorias)

O arquivo [docs/openapi.json](docs/openapi.json) pode ser importado no Postman ou no Insomnia. Também há exemplos em [docs/requisicoes.http](docs/requisicoes.http).

| Método | Rota | Acesso / finalidade |
| --- | --- | --- |
| GET | `/api/health` | Público, conexão com o banco |
| GET | `/api/openapi.json` | Público, contrato da API |
| POST | `/api/auth/cadastro` | Público, cadastrar usuário comum |
| POST | `/api/auth/login` | Público, receber token |
| POST | `/api/auth/logout` | Autenticado, revogar token atual |
| GET | `/api/auth/me` | Autenticado, consultar próprio perfil |
| PUT | `/api/auth/me` | Autenticado, atualizar nome e e-mail |
| GET | `/api/produtos` | Autenticado, listar produtos |
| GET | `/api/produtos/:id` | Autenticado, consultar produto |
| POST | `/api/produtos` | Administrador, criar produto |
| PUT | `/api/produtos/:id` | Administrador, editar produto |
| DELETE | `/api/produtos/:id` | Administrador, excluir produto |
| GET | `/api/categorias` | Autenticado, listar categorias |
| GET | `/api/categorias/:id` | Autenticado, consultar categoria |
| POST | `/api/categorias` | Administrador, criar categoria |
| PUT | `/api/categorias/:id` | Administrador, editar categoria |
| DELETE | `/api/categorias/:id` | Administrador, excluir categoria |
| GET | `/imagens/:arquivo` | Público, imagens incluídas no projeto |

`/produtos` e `/produtos/:id` continuam como aliases, com **as mesmas exigências de autenticação e permissão** de `/api/produtos`.

O frontend existente referencia `https://backend-ymc9.onrender.com/produtos`. Na verificação de 15/09/2026, esse endereço respondeu HTTP 500. Esse é um endereço encontrado no código, não uma publicação desta implementação. Nenhum deploy foi feito.

## Exemplos de consumo

Envie `Content-Type: application/json` quando houver corpo. Cadastro:

```json
{ "nome": "Maria Silva", "email": "maria@example.com", "senha": "UmaSenhaForte123!" }
```

Login (`POST /api/auth/login`):

```json
{ "email": "admin@example.com", "senha": "a-senha-que-voce-configurou" }
```

A resposta contém `token`, `tipo`, `expira_em` e `usuario`. Nas rotas protegidas, envie:

```http
Authorization: Bearer SEU_TOKEN
```

Categoria (`POST /api/categorias`):

```json
{ "nome": "Ração", "descricao": "Alimentos para pets" }
```

Produto (`POST /api/produtos`), usando o ID retornado pela categoria:

```json
{
  "nome": "Ração Premium para Cães",
  "categoria_id": 1,
  "quantidade": 20,
  "preco": 89.90,
  "descricao": "Pacote de 3 kg",
  "imagem": "/imagens/racao-cao.jpg"
}
```

`nome`, `quantidade`, `preco` e a categoria são obrigatórios no POST e PUT. `quantidade` e `preco` devem ser números JSON, não strings. O preço deve ser positivo com até duas casas decimais; a quantidade deve ser um inteiro não negativo. Alternativamente a `categoria_id`, envie `categoria` com o nome de uma categoria já existente (nunca os dois campos juntos).

`descricao` e `imagem` são opcionais. No POST, ficam vazias se omitidas; no PUT, mantêm os valores anteriores. Para apagá-las, envie `""`. A imagem aceita URL HTTP(S) ou caminho `/imagens/arquivo.jpg`. As listagens retornam arrays; produtos incluem `categoria_id`, `categoria` (nome) e `preco` numérico.

Respostas de exclusão e logout: `204`, sem corpo. Não tente chamar `response.json()` nessas respostas. Erros usam `{ "mensagem": "..." }`; validações acrescentam `erros: [{ "campo": "...", "mensagem": "..." }]`.

| HTTP | Significado |
| --- | --- |
| 200 / 201 / 204 | Sucesso / criado / sucesso sem corpo |
| 400 | Dados, ID ou JSON inválidos; categoria informada inexistente |
| 401 / 403 | Autenticação necessária ou inválida / permissão insuficiente |
| 404 / 409 | Recurso inexistente / duplicidade ou relacionamento em uso |
| 413 / 429 | JSON maior que 100 KB / mais de 30 tentativas de login e cadastro por IP em 15 minutos |
| 500 / 503 | Erro interno / banco indisponível no endpoint de saúde |

## Integração futura com o frontend

O frontend não foi alterado. Seu código atual não faz login nem envia Bearer; portanto, precisará dessa integração para acessar o backend protegido. Seu formulário atual envia `categoria` por nome: a categoria deve existir primeiro. Pode usar `VITE_API_URL=http://localhost:3000/api/produtos`, incluindo o token em todas as requisições de produtos. Para exibir uma imagem relativa, componha a URL com a origem do backend, por exemplo `http://localhost:3000/imagens/racao-cao.jpg`.

## Testes

```powershell
cd backend
npm ci
npm test
```

Os testes são independentes do `.env` e não acessam o banco configurado em `DB_*` ou `DATABASE_URL`. Usam PostgreSQL em WebAssembly (PGlite) em memória com SQL real, incluindo chaves estrangeiras, unicidade e migrações. Cobrem cadastro, login, logout, credenciais incorretas, ausência de usuário, acesso sem token, permissões, perfil, CRUD dos dois recursos, validações, erros, limite de tentativas, CORS e preservação de dados antigos. A conexão de rede e o TLS do PostgreSQL hospedado devem ser verificados no ambiente onde a API será executada.

## Estrutura

```text
backend/
  docs/             # Contrato OpenAPI e requisições de exemplo
  scripts/          # Migração e criação das contas iniciais
  src/
    controllers/    # Respostas HTTP dos recursos
    database/       # Pool PostgreSQL e migração transacional
    imgs/           # Imagens já existentes
    middlewares/    # Autenticação, autorização e erros
    routes/         # Rotas de autenticação e CRUD
    services/       # Regras e consultas parametrizadas
    validations/    # Schemas Zod
    app.js          # Aplicação Express
    config.js       # Configuração do ambiente
    server.js       # Inicialização do servidor
  test/             # Testes de integração
  .env.example
  database.sql
```

Referências de implementação: [tratamento de erros do Express](https://expressjs.com/en/guide/error-handling.html), [consultas parametrizadas do node-postgres](https://node-postgres.com/features/queries) e [schemas do Zod](https://zod.dev/api).
