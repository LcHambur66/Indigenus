import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";

function Listagem_Cliente_Adm() {
    const [clientes, setClientes] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        apiFetch("/clientes")
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.mensagem || "Não foi possível carregar os clientes.");
                setClientes(data);
            })
            .catch((error) => setErro(error.message));
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-3xl font-semibold text-slate-900">Clientes</h1>
                <p className="mb-6 text-sm text-slate-500">Clientes cadastrados no sistema.</p>
                {erro && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
                <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                    <table className="w-full min-w-[640px] text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr><th className="px-4 py-3">Nome</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Telefone</th><th className="px-4 py-3">CPF</th></tr>
                        </thead>
                        <tbody>
                            {clientes.map((cliente) => (
                                <tr key={cliente.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3 font-medium text-slate-900">{cliente.nome}</td>
                                    <td className="px-4 py-3">{cliente.email}</td>
                                    <td className="px-4 py-3">{cliente.telefone}</td>
                                    <td className="px-4 py-3">{cliente.cpf}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!clientes.length && !erro && <p className="p-6 text-sm text-slate-500">Nenhum cliente cadastrado.</p>}
                </div>
            </div>
        </main>
    )
}

export default Listagem_Cliente_Adm