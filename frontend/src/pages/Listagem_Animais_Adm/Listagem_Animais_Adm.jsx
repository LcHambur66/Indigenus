import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../services/api";

function Listagem_Animais_Adm() {
    const [animais, setAnimais] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        apiFetch("/animais")
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.mensagem || "Não foi possível carregar os animais.");
                setAnimais(data);
            })
            .catch((error) => setErro(error.message));
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900">Animais</h1>
                        <p className="text-sm text-slate-500">Animais cadastrados no sistema.</p>
                    </div>
                    <Link to="/animais/cadastro" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Cadastrar animal</Link>
                </div>
                {erro && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
                <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                    <table className="w-full min-w-[640px] text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr><th className="px-4 py-3">Nome</th><th className="px-4 py-3">Espécie</th><th className="px-4 py-3">Idade</th><th className="px-4 py-3">Cliente</th></tr>
                        </thead>
                        <tbody>
                            {animais.map((animal) => (
                                <tr key={animal.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3"><Link className="font-medium text-blue-600" to={`/animais/${animal.id}`}>{animal.nome}</Link></td>
                                    <td className="px-4 py-3">{animal.especie}</td>
                                    <td className="px-4 py-3">{animal.idade}</td>
                                    <td className="px-4 py-3">{animal.cliente_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!animais.length && !erro && <p className="p-6 text-sm text-slate-500">Nenhum animal cadastrado.</p>}
                </div>
            </div>
        </main>
    )
}

export default Listagem_Animais_Adm