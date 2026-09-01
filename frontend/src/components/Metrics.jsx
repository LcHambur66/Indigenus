import { Boxes, PackageCheck, DollarSign, AlertTriangle } from 'lucide-react';

export function Metrics({ produtos, formatadorMoeda }) {
  const totalProdutos = produtos.length;
  const totalItens = produtos.reduce((acc, p) => acc + Number(p.quantidade), 0);
  const valorTotalEstoque = produtos.reduce(
    (acc, p) => acc + Number(p.quantidade) * Number(p.preco),
    0
  );
  const estoqueBaixo = produtos.filter((p) => Number(p.quantidade) <= 10).length;

  return (
    <section className="metrics">
      <article className="metric-card">
        <div className="metric-header">
          <span>Produtos Cadastrados</span>
          <Boxes size={20} className="metric-icon" />
        </div>
        <strong>{totalProdutos}</strong>
        <small>Tipos de produtos no catálogo</small>
      </article>

      <article className="metric-card">
        <div className="metric-header">
          <span>Total de Itens</span>
          <PackageCheck size={20} className="metric-icon" />
        </div>
        <strong>{totalItens}</strong>
        <small>Unidades em estoque</small>
      </article>

      <article className="metric-card">
        <div className="metric-header">
          <span>Valor em Estoque</span>
          <DollarSign size={20} className="metric-icon" />
        </div>
        <strong>{formatadorMoeda.format(valorTotalEstoque)}</strong>
        <small>Valor total estimado</small>
      </article>

      <article className={`metric-card ${estoqueBaixo > 0 ? 'warning' : ''}`}>
        <div className="metric-header">
          <span>Estoque Baixo</span>
          <AlertTriangle size={20} className="metric-icon" />
        </div>
        <strong>{estoqueBaixo}</strong>
        <small>Itens com 10 ou menos unidades</small>
      </article>
    </section>
  );
}
