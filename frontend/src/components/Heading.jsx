import { RefreshCw } from 'lucide-react';

export function Heading({ carregando, onRecarregar }) {
  return (
    <section className="heading">
      <div>
        <span className="eyebrow">Painel de Gestão</span>
        <h1>Controle de Estoque</h1>
        <p>Gerencie produtos, quantidades e valores em tempo real.</p>
      </div>
      <button
        className="icon-button"
        type="button"
        title="Atualizar lista"
        onClick={onRecarregar}
      >
        <RefreshCw size={18} className={carregando ? 'spin' : ''} />
      </button>
    </section>
  );
}
