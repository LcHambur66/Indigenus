import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../services/api";

export default function AnimalDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    apiFetch(`/animais/${id}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.mensagem || "Animal não encontrado.");
        setAnimal(data);
      })
      .catch((error) => setErro(error.message));
  }, [id]);

  if (erro) return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><section className="rounded-2xl bg-white p-8 text-center shadow-sm"><p className="text-red-600">{erro}</p><button type="button" onClick={() => navigate(-1)} className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">Voltar</button></section></main>;
  if (!animal) return <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">Carregando animal...</main>;

  const dataNascimento = animal.data_nascimento ? new Date(String(animal.data_nascimento).slice(0, 10) + "T00:00:00").toLocaleDateString("pt-BR") : "Não informada";
  return <main className="min-h-screen bg-slate-50 p-5 md:p-10"><div className="mx-auto max-w-4xl"><header className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><Link to="/animais" className="text-sm text-blue-600">Animais</Link><h1 className="mt-2 text-3xl font-semibold">{animal.nome}</h1><p className="text-sm text-slate-500">Detalhes do animal cadastrado</p></div><div className="flex gap-3"><button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium">Voltar</button><Link to={`/animais/${id}/editar`} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">Editar</Link></div></header><section className="grid gap-5 sm:grid-cols-2"><Info label="Espécie" value={animal.especie} /><Info label="Raça" value={animal.raca || "Não informada"} /><Info label="Idade" value={`${animal.idade} anos`} /><Info label="Sexo" value={animal.sexo || "Não informado"} /><Info label="Data de nascimento" value={dataNascimento} /><Info label="Cliente" value={animal.cliente_id} /><div className="sm:col-span-2"><Info label="Detalhes" value={animal.detalhes || "Nenhum detalhe informado."} /></div></section></div></main>;
}
function Info({ label, value }) { return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 text-slate-800">{value}</p></div>; }
