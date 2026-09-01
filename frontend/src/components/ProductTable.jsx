import { Search, Boxes, Edit3, Trash2, LoaderCircle, AlertTriangle } from 'lucide-react';

export function ProductTable({
  produtos,
  busca,
  setBusca,
  carregando,
  erro,
  formatadorMoeda,
  onEditar,
  onExcluir,
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Catálogo de Produtos</h2>
          <p>{produtos.length} produto(s) encontrado(s)</p>
        </div>
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por produto ou categoria..."
          />
        </div>
      </div>

      {erro && (
        <div className="error-banner" role="alert">
          <AlertTriangle size={18} />
          <span>{erro}</span>
        </div>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Preço Unitário</th>
              <th>Subtotal</th>
              <th className="align-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan="7" className="state-cell">
                  <LoaderCircle size={22} className="spin" />
                  <span>Carregando dados do estoque...</span>
                </td>
              </tr>
            ) : produtos.length === 0 ? (
              <tr>
                <td colSpan="7" className="state-cell">
                  <Boxes size={32} />
                  <span>Nenhum produto encontrado.</span>
                </td>
              </tr>
            ) : (
              produtos.map((produto) => {
                const qtd = Number(produto.quantidade);
                const prc = Number(produto.preco);
                const subtotal = qtd * prc;
                const isEstoqueBaixo = qtd <= 10;

                return (
                  <tr key={produto.id}>
                    <td className="code-cell">#{produto.id}</td>
                    <td className="name-cell">
                      <strong>{produto.nome}</strong>
                    </td>
                    <td>
                      <span className="badge">{produto.categoria}</span>
                    </td>
                    <td>
                      <span className={`qty-pill ${isEstoqueBaixo ? 'low-stock' : ''}`}>
                        {qtd} UN
                      </span>
                    </td>
                    <td>{formatadorMoeda.format(prc)}</td>
                    <td className="subtotal-cell">{formatadorMoeda.format(subtotal)}</td>
                    <td className="align-right">
                      <div className="action-buttons">
                        <button
                          className="table-action"
                          type="button"
                          title={`Editar ${produto.nome}`}
                          onClick={() => onEditar(produto)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="table-action danger"
                          type="button"
                          title={`Excluir ${produto.nome}`}
                          onClick={() => onExcluir(produto)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
