import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setErro("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
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
        throw new Error(data.mensagem || "Email ou senha inválidos.");
      }

      // Salva o JWT no navegador
      localStorage.setItem("token", data.token);

      // Salva os dados do usuário, caso a API retorne
      if (data.usuario) {
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
      }

      if (data.usuario?.perfil === "ADM") {
        navigate("/dashboard/adm", { replace: true });
      } else {
        navigate("/dashboard/cliente", { replace: true });
      }
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h2 className="text-center text-3xl text-blue-600 mb-3">
            Bem Vindo de Volta!
          </h2>

          <div className="w-52 h-1 bg-blue-600 mx-auto mb-16"></div>

          <div className="bg-blue-100 rounded-4xl p-10 shadow-lg">
            <h1 className="text-4xl text-center text-blue-600 mb-10">
              IndigenusPet
            </h1>

            <form onSubmit={handleLogin}>
              <div className="mb-5">
                <label className="block text-sm mb-2">Email</label>

                <input
                  type="email"
                  placeholder="Ex: Joana@Exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-10 px-4 rounded-xl bg-white shadow-md outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-2">Senha</label>

                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full h-10 px-4 rounded-xl bg-white shadow-md outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {erro && (
                <p className="text-red-600 text-sm text-center mb-4">{erro}</p>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-2xl font-semibold px-7 py-2 rounded-lg shadow-md transition"
                >
                  {loading ? "Entrando..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
