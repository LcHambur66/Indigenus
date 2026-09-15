import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import animalRoutes from './routes/animalRoutes.js';
import { initializeDatabase } from './config/database.js';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
let bancoStatus = 'desconectado';

// Middlewares
app.use(cors());
app.use(express.json());

// Registro das rotas principais
app.use('/auth', authRoutes);
app.use('/clientes', clienteRoutes);
app.use('/animais', animalRoutes);

app.get('/status', (req, res) => {
  const url = `http://localhost:${PORT}`;

  res.json({
    status: bancoStatus === 'conectado' ? 'online' : 'degradado',
    banco: bancoStatus,
    porta: PORT,
    url,
  });
});

app.use((req, res) => res.status(404).json({ mensagem: 'Rota não encontrada' }));

// Inicialização do banco antes do servidor HTTP
initializeDatabase()
  .then(() => {
    bancoStatus = 'conectado';

    app.listen(PORT, () => {
      console.log('API iniciada com sucesso.');
      console.log(`Banco: conectado (${process.env.DB_NAME || 'não informado'})`);
      console.log(`Porta: ${PORT}`);
      console.log(`URL: http://localhost:${PORT}`);
      console.log(`Status: http://localhost:${PORT}/status`);
    });
  })
  .catch((error) => {
    console.error('Erro ao inicializar o banco de dados:', error);
    console.log(`API iniciada sem conexão com o banco.`);
    console.log(`Porta: ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Status: http://localhost:${PORT}/status`);

    app.listen(PORT, () => {
      console.log('Acesse /status para verificar o estado atual da API e do banco.');
    });
  });
