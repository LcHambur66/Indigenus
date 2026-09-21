import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../../services/api";

export default function AtualizarAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    especie: "",
    raca: "",
    idade: "",
    sexo: "",
    data_nascimento: "",
    detalhes: "",
    cliente_id: "",
    foto: null,
  });

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch(`/animais/${id}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.mensagem || "Não foi possível carregar o animal.");
        setForm({ ...data, data_nascimento: data.data_nascimento?.slice(0, 10) || "", foto: null });
      })
      .catch((error) => setErro(error.message));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const response = await apiFetch(`/animais/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          nome: form.nome,
          especie: form.especie,
          raca: form.raca || null,
          idade: Number(form.idade),
          sexo: form.sexo || null,
          data_nascimento: form.data_nascimento || null,
          detalhes: form.detalhes || null,
          cliente_id: Number(form.cliente_id),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.mensagem || "Não foi possível atualizar o animal.");
      navigate(`/animais/${id}`);
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        
        {/* Lado esquerdo */}
        <div className="bg-teal-400 text-white p-6 sm:p-8 md:w-2/5 flex flex-col justify-center order-2 md:order-1">
          <span className="bg-white/20 text-xs font-medium px-3 py-1 rounded-full w-fit mb-4 sm:mb-6">
            PERFIL DO PET
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Atualizar</h1>
          <p className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Edite os dados do pet.</p>
          <div className="w-12 h-0.5 bg-white mb-3 sm:mb-4"></div>
          <p className="text-sm opacity-90 leading-relaxed">
            Altere as informações necessárias e salve as mudanças.
          </p>
        </div>
        <div className="p-5 sm:p-6 md:p-8 md:w-3/5 order-1 md:order-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Formulário</h2>
          <p className="text-sm text-gray-500 mb-5 sm:mb-6">Atualize os dados do seu animal.</p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do animal</label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Espécie</label>
                <input
                  type="text"
                  name="especie"
                  value={form.especie}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Raça</label>
                <input
                  type="text"
                  name="raca"
                  value={form.raca}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                <input type="number" name="idade" min="0" value={form.idade} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                <div className="flex gap-4">
                  {["M", "F", "C"].map((opcao) => (
                    <label key={opcao} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="sexo"
                        value={opcao}
                        checked={form.sexo === opcao}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">{opcao}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de nascimento</label>
                <input
                  type="date"
                  name="data_nascimento"
                  value={form.data_nascimento}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto do animal:</label>
              <label className="flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px] sm:text-xs text-gray-500 text-center px-1">
                  Alterar foto<br />PNG, JPG ou JPEG
                </span>
                <input type="file" name="foto" accept="image/png,image/jpeg,image/jpg" onChange={handleChange} className="hidden" />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Informações adicionais</label>
              <input
                type="text"
                name="detalhes"
                value={form.detalhes}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID do cliente</label>
              <input type="number" name="cliente_id" min="1" value={form.cliente_id} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {erro && <p className="text-sm text-red-600">{erro}</p>}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
              >
                {loading ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}