import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Cadastro() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");

    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCadastro = async (e) => {
        e.preventDefault();

        setErro("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    senha,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.mensagem || "Erro ao realizar cadastro."
                );
            }

            const clienteResponse = await fetch("http://localhost:3000/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.token}`,
                },
                body: JSON.stringify({
                    nome,
                    cpf,
                    email,
                    telefone,
                }),
            });
            const clienteData = await clienteResponse.json();

            if (!clienteResponse.ok) {
                throw new Error(
                    clienteData.mensagem || "Erro ao cadastrar cliente."
                );
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
            navigate("/login");

        } catch (error) {
            setErro(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-600">

            <div className="flex w-[900px] h-[500px] rounded-3xl overflow-hidden shadow-lg">

                {/* LADO ESQUERDO */}
                <div className="w-1/2 bg-white flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-3xl text-blue-600">
                            Cuidando do bem estar
                        </h2>

                        <h2 className="text-3xl text-blue-600">
                            do seu animal acima de
                        </h2>

                        <h2 className="text-3xl text-blue-600">
                            tudo
                        </h2>
                    </div>
                </div>

                {/* LADO DIREITO */}
                <div className="w-1/2 bg-blue-500 p-8">

                    <h1 className="text-3xl text-white text-center mb-5">
                        IndigenusPet
                    </h1>

                    <form onSubmit={handleCadastro}>

                        <label className="text-white text-sm">
                            Nome
                        </label>

                        <input
                            type="text"
                            placeholder="Ex: Carlos Alberto"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            className="w-full h-9 px-3 mb-2 rounded-lg bg-white"
                        />

                        <label className="text-white text-sm">
                            CPF
                        </label>

                        <input
                            type="text"
                            placeholder="Ex: 000.000.000-00"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            required
                            className="w-full h-9 px-3 mb-2 rounded-lg bg-white"
                        />

                        <label className="text-white text-sm">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Ex: Carlos@Example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-9 px-3 mb-2 rounded-lg bg-white"
                        />

                        <label className="text-white text-sm">
                            Telefone
                        </label>

                        <input
                            type="text"
                            placeholder="Ex: (19) 99911-2113"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            required
                            className="w-full h-9 px-3 mb-2 rounded-lg bg-white"
                        />

                        <label className="text-white text-sm">
                            Senha
                        </label>

                        <input
                            type="password"
                            placeholder="Ex: 12345678"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            className="w-full h-9 px-3 mb-5 rounded-lg bg-white"
                        />

                        {erro && (
                            <p className="text-red-200 text-sm text-center mb-3">
                                {erro}
                            </p>
                        )}

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-white text-gray-800 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition"
                            >
                                {loading ? "Cadastrando..." : "Cadastrar"}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}

export default Cadastro;