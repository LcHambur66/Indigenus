import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PackagePlus, Edit3, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { Header } from './components/Header';
import { Heading } from './components/Heading';
import { Metrics } from './components/Metrics';
import { ProductTable } from './components/ProductTable';
import { ProductModal } from './components/ProductModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import './App.css';

const apiUrl = import.meta.env.VITE_API_URL || 'https://backend-ymc9.onrender.com/produtos';

// Formatador de Moeda para BRL (R$)
const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function App() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [dialogoAberto, setDialogoAberto] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  const [salvando, setSalvando] = useState(false);

  // Carregar produtos da API
  async function carregarProdutos(silencioso = false) {
    if (!silencioso) setCarregando(true);
    setErro('');
    try {
      const resposta = await fetch(apiUrl);
      if (!resposta.ok) {
        throw new Error('Não foi possível carregar os produtos do banco.');
      }
      const dados = await resposta.json();
      setProdutos(dados);
    } catch (error) {
      setErro(error.message);
      toast.error('Erro ao conectar com a API: ' + error.message, {
        icon: <AlertCircle size={20} />,
      });
    } finally {
      if (!silencioso) setCarregando(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  function handleAbrirFormulario(produto = null) {
    setProdutoEmEdicao(produto);
    setDialogoAberto(true);
  }

  // Salvar (Criar ou Editar)
  async function handleSalvarProduto(dados) {
    setSalvando(true);
    setErro('');
    const ehEdicao = Boolean(produtoEmEdicao);

    try {
      const url = ehEdicao ? `${apiUrl}/${produtoEmEdicao.id}` : apiUrl;
      const metodo = ehEdicao ? 'PUT' : 'POST';

      const resposta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        throw new Error('Erro ao processar a operação no banco.');
      }

      setDialogoAberto(false);
      await carregarProdutos(true);

      if (ehEdicao) {
        toast.info(`Produto "${dados.nome}" atualizado com sucesso!`, {
          icon: <Edit3 size={20} />,
        });
      } else {
        toast.success(`Produto "${dados.nome}" cadastrado com sucesso!`, {
          icon: <PackagePlus size={20} />,
        });
      }
    } catch (error) {
      setErro(error.message);
      toast.error('Falha ao salvar produto: ' + error.message, {
        icon: <AlertCircle size={20} />,
      });
    } finally {
      setSalvando(false);
    }
  }

  // Excluir
  async function handleExcluirProduto() {
    if (!produtoParaExcluir) return;
    const nomeProduto = produtoParaExcluir.nome;

    try {
      const resposta = await fetch(`${apiUrl}/${produtoParaExcluir.id}`, {
        method: 'DELETE',
      });

      if (!resposta.ok) {
        throw new Error('Erro ao excluir o produto da base de dados.');
      }

      setProdutoParaExcluir(null);
      await carregarProdutos(true);
      toast.warning(`Produto "${nomeProduto}" removido do estoque!`, {
        icon: <Trash2 size={20} />,
      });
    } catch (error) {
      setErro(error.message);
      toast.error('Falha ao excluir produto: ' + error.message, {
        icon: <AlertCircle size={20} />,
      });
    }
  }

  const produtosFiltrados = produtos.filter((p) =>
    `${p.nome} ${p.categoria}`.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="app-shell">
      {/* Container Toasty com Barra de Tempo e Ícones Lucide */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Componentes Modularizados */}
      <Header onNovoProduto={() => handleAbrirFormulario()} />

      <Heading
        carregando={carregando}
        onRecarregar={() => {
          carregarProdutos();
          toast.info('Lista de produtos atualizada.', {
            icon: <RefreshCw size={20} />,
          });
        }}
      />

      <Metrics produtos={produtos} formatadorMoeda={formatadorMoeda} />

      <ProductTable
        produtos={produtosFiltrados}
        busca={busca}
        setBusca={setBusca}
        carregando={carregando}
        erro={erro}
        formatadorMoeda={formatadorMoeda}
        onEditar={handleAbrirFormulario}
        onExcluir={setProdutoParaExcluir}
      />

      <ProductModal
        aberto={dialogoAberto}
        onOpenChange={setDialogoAberto}
        produtoEmEdicao={produtoEmEdicao}
        onSalvar={handleSalvarProduto}
        salvando={salvando}
      />

      <ConfirmDeleteModal
        produtoParaExcluir={produtoParaExcluir}
        onClose={() => setProdutoParaExcluir(null)}
        onConfirmar={handleExcluirProduto}
      />
    </div>
  );
}

export default App;