import { Boxes, PackagePlus } from 'lucide-react';

export function Header({ onNovoProduto }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-icon">
          <Boxes size={22} />
        </div>
        <span className="brand-title">Estoque System</span>
      </div>
      <button className="button primary" type="button" onClick={onNovoProduto}>
        <PackagePlus size={18} />
        <span>Novo Produto</span>
      </button>
    </header>
  );
}
