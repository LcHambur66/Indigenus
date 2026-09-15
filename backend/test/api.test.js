import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { PGlite } from '@electric-sql/pglite';
import { createApp } from '../src/app.js';
import { migrate } from '../src/database/migrate.js';
import { hashPassword } from '../src/services/authService.js';
import { createInitialUsers } from '../src/services/initialUsersService.js';

const config = { jwtSecret: 'chave-exclusiva-dos-testes-com-mais-de-32-caracteres', origins: ['http://localhost:5173'] };
const engine = new PGlite();
// PostgreSQL compilado para WASM, sem substituir consultas SQL por mocks.
function adapter(pg) {
  const db = {
    async query(sql, params) {
      const result = params ? await pg.query(sql, params) : (await pg.exec(sql)).at(-1);
      return { ...result, rowCount: result.affectedRows ?? result.rows.length };
    },
    async connect() { return { query: db.query, release() {} }; },
  };
  return db;
}
const db = adapter(engine);
const api = request(createApp({ db, config }));
let adminToken;
let userToken;
const user = { nome: 'Maria Silva', email: 'maria@example.com', senha: 'SenhaTeste123!' };
const admin = { nome: 'Administrador', email: 'admin@example.com', senha: 'AdminTeste123!' };
const bearer = token => ({ Authorization: `Bearer ${token}` });

before(async () => {
  await migrate(db);
  await db.query("INSERT INTO usuarios (nome, email, senha_hash, papel) VALUES ($1, $2, $3, 'administrador')", [admin.nome, admin.email, await hashPassword(admin.senha)]);
  adminToken = (await api.post('/api/auth/login').send({ email: admin.email, senha: admin.senha }).expect(200)).body.token;
});
after(async () => { await engine.close(); });

test('contas do .env: criação, login, permissões, repetição e reversão de conflitos', async () => {
  const accountsEngine = new PGlite();
  const accountsDb = adapter(accountsEngine);
  const env = {
    ADMIN_NAME: 'Admin do ambiente', ADMIN_EMAIL: ' ADMIN.ENV@example.com ', ADMIN_PASSWORD: 'SenhaAdminEnv123!',
    CLIENT_NAME: 'Cliente do ambiente', CLIENT_EMAIL: ' CLIENT.ENV@example.com ', CLIENT_PASSWORD: 'SenhaClienteEnv123!',
  };
  try {
    await migrate(accountsDb);
    await assert.rejects(createInitialUsers(accountsDb, { ...env, CLIENT_PASSWORD: '' }), /CLIENT_PASSWORD/);
    await assert.rejects(createInitialUsers(accountsDb, { ...env, CLIENT_EMAIL: 'admin.env@example.com' }), /devem ser diferentes/);
    assert.equal((await accountsDb.query('SELECT COUNT(*) FROM usuarios')).rows[0].count, 0);
    assert.deepEqual(await createInitialUsers(accountsDb, env), [{ papel: 'administrador', criada: true }, { papel: 'usuario', criada: true }]);

    const accountsApi = request(createApp({ db: accountsDb, config }));
    for (const [prefix, papel, writeStatus] of [['ADMIN', 'administrador', 201], ['CLIENT', 'usuario', 403]]) {
      const login = await accountsApi.post('/api/auth/login').send({ email: env[`${prefix}_EMAIL`], senha: env[`${prefix}_PASSWORD`] }).expect(200);
      assert.equal(login.body.usuario.papel, papel);
      await accountsApi.post('/api/categorias').set(bearer(login.body.token)).send({ nome: 'Categoria do ambiente' }).expect(writeStatus);
    }
    const stored = (await accountsDb.query('SELECT * FROM usuarios ORDER BY id')).rows;
    assert.notEqual(stored[0].senha_hash, env.ADMIN_PASSWORD);
    assert.notEqual(stored[1].senha_hash, env.CLIENT_PASSWORD);
    assert.deepEqual(await createInitialUsers(accountsDb, { ...env, ADMIN_PASSWORD: 'OutraSenhaAdmin123!', CLIENT_PASSWORD: 'OutraSenhaCliente123!' }), [{ papel: 'administrador', criada: false }, { papel: 'usuario', criada: false }]);
    assert.deepEqual((await accountsDb.query('SELECT * FROM usuarios ORDER BY id')).rows, stored);

    // A primeira inserção deve ser revertida se o segundo e-mail já for de um adm.
    await assert.rejects(createInitialUsers(accountsDb, { ...env, ADMIN_EMAIL: 'novo.admin@example.com', CLIENT_EMAIL: 'admin.env@example.com' }), /outro tipo de conta/);
    assert.deepEqual((await accountsDb.query('SELECT * FROM usuarios ORDER BY id')).rows, stored);
  } finally { await accountsEngine.close(); }
});

test('cadastro normaliza email, protege senha e impede atribuição de administrador', async () => {
  const response = await api.post('/api/auth/cadastro').send({ ...user, email: ' MARIA@example.com ' }).expect(201);
  assert.equal(response.body.email, user.email);
  assert.equal(response.body.papel, 'usuario');
  assert.equal(response.body.senha_hash, undefined);
  const stored = (await db.query('SELECT senha_hash FROM usuarios WHERE email = $1', [user.email])).rows[0];
  assert.notEqual(stored.senha_hash, user.senha);
  await api.post('/api/auth/cadastro').send(user).expect(409);
  await api.post('/api/auth/cadastro').send({ ...user, email: 'admin2@example.com', papel: 'administrador' }).expect(400);
  for (const data of [{}, { ...user, nome: ' ' }, { ...user, email: 'errado' }, { ...user, senha: '123' }, { ...user, senha: 'á'.repeat(40) }]) {
    await api.post('/api/auth/cadastro').send(data).expect(400);
  }
});

test('login, credenciais incorretas, usuário inexistente e perfil próprio', async () => {
  const response = await api.post('/api/auth/login').send({ email: user.email, senha: user.senha }).expect(200);
  userToken = response.body.token;
  assert.equal(response.body.usuario.papel, 'usuario');
  assert.equal(response.body.usuario.senha_hash, undefined);
  const invalid = await api.post('/api/auth/login').send({ email: user.email, senha: 'incorreta' }).expect(401);
  const missing = await api.post('/api/auth/login').send({ email: 'ninguem@example.com', senha: 'incorreta' }).expect(401);
  assert.deepEqual(invalid.body, missing.body);
  await api.post('/api/auth/login').send({ email: user.email, senha: 'á'.repeat(40) }).expect(400);
  await api.get('/api/auth/me').set(bearer(userToken)).expect(200);
  const updated = await api.put('/api/auth/me').set(bearer(userToken)).send({ nome: 'Maria Atualizada', email: user.email }).expect(200);
  assert.equal(updated.body.nome, 'Maria Atualizada');
  await api.put('/api/auth/me').set(bearer(userToken)).send({ nome: user.nome, email: admin.email }).expect(409);
  await api.put('/api/auth/me').set(bearer(userToken)).send({ nome: user.nome, email: user.email, papel: 'administrador' }).expect(400);
});

test('rotas exigem autenticação e as escritas exigem administrador, inclusive alias antigo', async () => {
  for (const path of ['/api/produtos', '/produtos', '/api/categorias']) {
    await api.get(path).expect(401);
    await api.get(path).set(bearer('token-invalido')).expect(401);
    await api.get(path).set(bearer(userToken)).expect(200);
    await api.post(path).set(bearer(userToken)).send({}).expect(403);
    await api.put(`${path}/1`).set(bearer(userToken)).send({}).expect(403);
    await api.delete(`${path}/1`).set(bearer(userToken)).expect(403);
  }
});

test('CRUD de categorias e produtos com relacionamento, imagem e preço numérico', async () => {
  const categoria = (await api.post('/api/categorias').set(bearer(adminToken)).send({ nome: 'Ração', descricao: 'Alimentos para pets' }).expect(201)).body;
  await api.post('/api/categorias').set(bearer(adminToken)).send({ nome: 'RAÇÃO' }).expect(409);
  await api.get(`/api/categorias/${categoria.id}`).set(bearer(userToken)).expect(200);
  const dados = { nome: 'Ração Premium', categoria_id: categoria.id, quantidade: 20, preco: 89.9, descricao: 'Pacote de 3 kg', imagem: '/imagens/racao-cao.jpg' };
  const response = await api.post('/api/produtos').set(bearer(adminToken)).send(dados).expect(201);
  const produto = response.body;
  assert.equal(response.headers.location, `/api/produtos/${produto.id}`);
  assert.equal(produto.categoria, 'Ração');
  assert.equal(produto.preco, 89.9);
  assert.equal(produto.imagem, dados.imagem);
  const lista = (await api.get('/produtos').set(bearer(userToken)).expect(200)).body;
  assert.ok(lista.some(item => item.id === produto.id));
  await api.get(`/api/produtos/${produto.id}`).set(bearer(userToken)).expect(200);
  await api.delete(`/api/categorias/${categoria.id}`).set(bearer(adminToken)).expect(409);
  await api.put(`/api/categorias/${categoria.id}`).set(bearer(adminToken)).send({ nome: 'Alimentos', descricao: 'Categoria atualizada' }).expect(200);
  const atualizado = (await api.put(`/produtos/${produto.id}`).set(bearer(adminToken)).send({ nome: 'Ração Atualizada', categoria: 'Alimentos', quantidade: 10, preco: 99.99 }).expect(200)).body;
  assert.equal(atualizado.categoria_id, categoria.id);
  assert.equal(atualizado.preco, 99.99);
  assert.equal(atualizado.imagem, dados.imagem);
  assert.equal(atualizado.descricao, dados.descricao);
  await api.delete(`/api/produtos/${produto.id}`).set(bearer(adminToken)).expect(204);
  await api.get(`/api/produtos/${produto.id}`).set(bearer(userToken)).expect(404);
  await api.delete(`/api/produtos/${produto.id}`).set(bearer(adminToken)).expect(404);
  await api.delete(`/api/categorias/${categoria.id}`).set(bearer(adminToken)).expect(204);
  await api.get(`/api/categorias/${categoria.id}`).set(bearer(userToken)).expect(404);
});

test('validação rejeita campos vazios, preço/estoque inválidos, IDs e categorias inexistentes', async () => {
  const data = { nome: 'Produto Teste', categoria_id: 999, quantidade: 1, preco: 10 };
  for (const change of [{ nome: '' }, { quantidade: -1 }, { quantidade: 1.5 }, { preco: 0 }, { preco: 1.234 }, { preco: '' }, { categoria_id: null }, { imagem: 'javascript:alert(1)' }, { extra: true }]) {
    await api.post('/api/produtos').set(bearer(adminToken)).send({ ...data, ...change }).expect(400);
  }
  await api.post('/api/produtos').set(bearer(adminToken)).send(data).expect(400);
  await api.post('/api/categorias').set(bearer(adminToken)).send({ nome: '' }).expect(400);
  for (const path of ['/api/produtos', '/api/categorias']) {
    for (const id of ['abc', '-1', '0', '1.5', '99999999999999999']) await api.get(`${path}/${id}`).set(bearer(userToken)).expect(400);
    await api.put(`${path}/99999`).set(bearer(adminToken)).send(path.endsWith('produtos') ? data : { nome: 'Inexistente' }).expect(404);
    await api.delete(`${path}/99999`).set(bearer(adminToken)).expect(404);
  }
});

test('tokens expirados, assinatura incorreta e sessões expiradas são rejeitados', async () => {
  const claims = { algorithm: 'HS256', subject: '1', jwtid: randomUUID(), issuer: 'indigenus-api', audience: 'indigenus-client' };
  for (const token of [jwt.sign({}, config.jwtSecret, { ...claims, expiresIn: -1 }), jwt.sign({}, 'chave-incorreta', { ...claims, expiresIn: '1h' })]) {
    await api.get('/api/auth/me').set(bearer(token)).expect(401);
  }
  const session = (await api.post('/api/auth/login').send({ email: user.email, senha: user.senha }).expect(200)).body;
  await db.query("UPDATE sessoes SET expira_em = NOW() - INTERVAL '1 hour' WHERE id = $1", [jwt.decode(session.token).jti]);
  await api.get('/api/auth/me').set(bearer(session.token)).expect(401);
});

test('logout revoga apenas a sessão atual e impede reutilização do JWT', async () => {
  const outraSessao = (await api.post('/api/auth/login').send({ email: user.email, senha: user.senha }).expect(200)).body.token;
  await api.post('/api/auth/logout').set(bearer(userToken)).expect(204);
  await api.get('/api/produtos').set(bearer(userToken)).expect(401);
  await api.post('/api/auth/logout').set(bearer(userToken)).expect(401);
  await api.get('/api/auth/me').set(bearer(outraSessao)).expect(200);
  await api.post('/api/auth/logout').expect(401);
});

test('saúde, imagens, CORS, documentação, JSON inválido e rota inexistente', async () => {
  await api.get('/api/health').expect(200, { status: 'ok' });
  await api.get('/imagens/racao-cao.jpg').expect(200).expect('Content-Type', /image\/jpeg/);
  await api.options('/api/produtos').set('Origin', config.origins[0]).set('Access-Control-Request-Method', 'POST').expect(204).expect('Access-Control-Allow-Origin', config.origins[0]);
  const denied = await api.get('/api/health').set('Origin', 'https://outro.example');
  assert.equal(denied.headers['access-control-allow-origin'], undefined);
  const doc = (await api.get('/api/openapi.json').expect(200)).body;
  assert.equal(doc.openapi, '3.0.3');
  assert.ok(doc.paths['/api/auth/logout']);
  await api.post('/api/auth/login').set('Content-Type', 'application/json').send('{').expect(400);
  await api.post('/api/auth/login').send({ grande: 'a'.repeat(110000) }).expect(413);
  await api.get('/rota-inexistente').expect(404);
});

test('indisponibilidade do banco retorna erro controlado', async () => {
  const unavailable = request(createApp({ db: { query: async () => { throw new Error('detalhe privado'); } }, config }));
  await unavailable.get('/api/health').expect(503, { mensagem: 'Banco de dados indisponível.' });
  await unavailable.get('/api/auth/me').set(bearer(adminToken)).expect(500, { mensagem: 'Erro interno do servidor.' });
});

test('limitação de tentativas de autenticação responde 429', async () => {
  const limited = request(createApp({ db, config }));
  for (let index = 0; index < 30; index++) await limited.post('/api/auth/login').send({}).expect(400);
  await limited.post('/api/auth/login').send({}).expect(429);
});

test('migração pode repetir e converte estrutura antiga sem perder os produtos', async () => {
  const legacyEngine = new PGlite();
  const legacy = adapter(legacyEngine);
  try {
    await legacy.query('CREATE TABLE produtos (id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL, categoria VARCHAR(100) NOT NULL, quantidade INTEGER NOT NULL, preco NUMERIC(10,2) NOT NULL, imagem VARCHAR(255) NOT NULL)');
    await legacy.query('INSERT INTO produtos (nome, categoria, quantidade, preco, imagem) VALUES ($1,$2,$3,$4,$5)', ['Produto Antigo', 'Ração', 10, 25.5, 'imagem-antiga.jpg']);
    await migrate(legacy);
    await migrate(legacy);
    const { rows } = await legacy.query('SELECT p.*, c.nome AS categoria FROM produtos p JOIN categorias c ON c.id = p.categoria_id');
    assert.equal(rows.length, 1);
    assert.equal(rows[0].nome, 'Produto Antigo');
    assert.equal(rows[0].categoria, 'Ração');
    assert.equal(rows[0].imagem, 'imagem-antiga.jpg');
    assert.equal(Number(rows[0].preco), 25.5);
    await assert.rejects(legacy.query('UPDATE produtos SET quantidade = -1'), error => error.code === '23514');
  } finally { await legacyEngine.close(); }
  await migrate(db);
  assert.equal((await db.query('SELECT COUNT(*) FROM usuarios')).rows[0].count, 2);
});
