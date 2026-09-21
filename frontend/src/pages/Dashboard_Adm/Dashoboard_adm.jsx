import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";

const menu = [
  ["Clientes", "/clientes"],
  ["Animais", "/animais"],
  ["Serviços", "/servicos"],
  ["Agendamentos", "/agendamentos"],
  ["Atendimentos", "/atendimentos"],
  ["Financeiro", "/financeiro"],
  ["Usuários", "/usuarios"],
  ["Permissões", "/permissoes"],
];

function DashboardAdm() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ clientes: 0, animais: 0 });
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.all([apiFetch("/clientes"), apiFetch("/animais")])
      .then(async ([clientesResponse, animaisResponse]) => {
        const clientes = await clientesResponse.json();
        const animais = await animaisResponse.json();
        if (!clientesResponse.ok || !animaisResponse.ok) throw new Error("Não foi possível carregar o resumo.");
        setCounts({ clientes: clientes.length, animais: animais.length });
      })
      .catch((error) => setErro(error.message));
  }, []);

  const sair = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="p-5"><Link to="/dashboard/adm" className="inline-flex rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">IndigenusPet · Dashboard</Link></div>
        <nav className="flex-1 space-y-1 px-4"><p className="mb-3 px-2 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Navegação</p>{menu.map(([label, path]) => <Link key={path} to={path} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">{label}</Link>)}</nav>
        <button type="button" onClick={sair} className="m-4 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600">Sair</button>
      </aside>
      <main className="flex-1 overflow-y-auto p-5 md:p-8"><div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-slate-500">Resumo geral</p><h1 className="text-3xl font-semibold">Dashboard administrativo</h1></div><Link to="/" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">Página inicial</Link></div>
        {erro && <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
        <div className="mb-8 grid gap-5 sm:grid-cols-2"><StatCard label="Clientes cadastrados" value={counts.clientes} color="blue" /><StatCard label="Animais cadastrados" value={counts.animais} color="violet" /></div>
        <section className="mb-8"><h2 className="mb-4 text-lg font-semibold">Acesso aos cadastros</h2><div className="grid gap-5 sm:grid-cols-2"><ActionCard title="Clientes" description="Consulte e gerencie os clientes." to="/clientes" color="blue" /><ActionCard title="Animais" description="Consulte, cadastre e atualize animais." to="/animais" color="violet" /></div></section>
        <section><h2 className="mb-4 text-lg font-semibold">Módulos do sistema</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{menu.slice(2).map(([title, to]) => <ActionCard key={to} title={title} description="Abrir módulo" to={to} color="slate" />)}</div></section>
      </div></main>
    </div>
  );
}

function StatCard({ label, value, color }) { const colorClass = color === "violet" ? "bg-violet-50 text-violet-700" : "bg-blue-50 text-blue-700"; return <div className={`rounded-2xl border border-slate-200 p-6 ${colorClass}`}><p className="text-sm font-medium">{label}</p><p className="mt-2 text-4xl font-bold">{value}</p></div>; }
function ActionCard({ title, description, to, color }) { const colorClass = color === "violet" ? "bg-violet-600 hover:bg-violet-700" : color === "blue" ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-700 hover:bg-slate-800"; return <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-semibold">{title}</h3><p className="mb-5 mt-2 flex-1 text-sm text-slate-500">{description}</p><Link to={to} className={`rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white transition ${colorClass}`}>Abrir</Link></div>; }

export default DashboardAdm;
