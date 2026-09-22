import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";

function DashboardCliente() {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [animais, setAnimais] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.all([apiFetch("/clientes/me"), apiFetch("/animais")])
      .then(async ([clienteResponse, animaisResponse]) => {
        const clienteData = await clienteResponse.json();
        const animaisData = await animaisResponse.json();
        if (!clienteResponse.ok || !animaisResponse.ok) throw new Error("Não foi possível carregar seus dados.");
        setCliente(clienteData);
        setAnimais(animaisData);
      })
      .catch((error) => setErro(error.message));
  }, []);

  const sair = () => { localStorage.removeItem("token"); localStorage.removeItem("usuario"); navigate("/login", { replace: true }); };

  return <main className="min-h-screen bg-slate-50 p-5 md:p-10"><div className="mx-auto max-w-5xl">
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-slate-500">Área do cliente</p><h1 className="text-3xl font-semibold">Olá, {cliente?.nome || "cliente"}</h1></div><button type="button" onClick={sair} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-red-50 hover:text-red-600">Sair</button></header>
    {erro && <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
    <section className="mb-8 grid gap-5 sm:grid-cols-3"><Info label="Meus animais" value={animais.length} /><Info label="Telefone" value={cliente?.telefone || "-"} /><Info label="E-mail" value={cliente?.email || "-"} /></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">Meus animais</h2><Link to="/animais/cadastro" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Cadastrar animal</Link></div>
      {animais.length ? <div className="grid gap-4 sm:grid-cols-2">{animais.map((animal) => <Link key={animal.id} to={`/animais/${animal.id}`} className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-400 hover:shadow-sm"><h3 className="font-semibold text-blue-700">{animal.nome}</h3><p className="mt-1 text-sm text-slate-500">{animal.especie} · {animal.idade} anos</p></Link>)}</div> : <p className="text-sm text-slate-500">Você ainda não possui animais cadastrados.</p>}
    </section>
  </div></main>;
}

function Info({ label, value }) { return <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 truncate text-lg font-semibold text-slate-800">{value}</p></div>; }

export default DashboardCliente;
