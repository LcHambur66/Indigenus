import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";

export default function CadastroAnimal() {
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

  const [fotoPreview, setFotoPreview] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarCliente = async () => {
      const response = await apiFetch("/clientes/me");
      if (response.ok) {
        const cliente = await response.json();
        setForm((prev) => ({ ...prev, cliente_id: String(cliente.id) }));
      }
    };

    carregarCliente().catch(() => undefined);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const arquivo = files[0];
      setFotoPreview(URL.createObjectURL(arquivo));
      setForm((prev) => ({
        ...prev,
        [name]: arquivo,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const payload = {
      nome: form.nome,
      especie: form.especie,
      raca: form.raca || null,
      idade: Number(form.idade),
      sexo: form.sexo || null,
      data_nascimento: form.data_nascimento || null,
      detalhes: form.detalhes || null,
      cliente_id: Number(form.cliente_id),
    };

    try {
      const response = await apiFetch("/animais", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensagem || "Erro ao salvar o animal");
      }

      alert("Animal cadastrado com sucesso!");

      setForm({
        nome: "",
        especie: "",
        raca: "",
        idade: "",
        sexo: "",
        data_nascimento: "",
        detalhes: "",
        cliente_id: form.cliente_id,
        foto: null,
      });
      setFotoPreview(null);
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        
        <div className="bg-teal-400 text-white p-8 md:w-2/5 flex flex-col justify-center">
          <span className="bg-white/20 text-xs font-medium px-3 py-1 rounded-full w-fit mb-6">
            PERFIL DO PET
          </span>
          <h1 className="text-3xl font-bold mb-2">Bem-vindo!</h1>
          <p className="text-lg font-medium mb-4">Cadastre seu pet.</p>
          <p className="text-sm opacity-90">
            Preencha os dados para criar e manter o perfil do seu animal.
          </p>
        </div>

        <div className="p-8 md:w-3/5">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Formulário</h2>
          <p className="text-sm text-gray-500 mb-6">Informe os dados do seu animal.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do animal
              </label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Espécime
                </label>
                <input
                  type="text"
                  name="especie"
                  value={form.especie}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raça
                </label>
                <input
                  type="text"
                  name="raca"
                  value={form.raca}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idade
                </label>
                <input
                  type="number"
                  name="idade"
                  min="0"
                  value={form.idade}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID do cliente
                </label>
                <input
                  type="number"
                  name="cliente_id"
                  min="1"
                  value={form.cliente_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo
                </label>
                <div className="flex gap-4">
                  {[
                    { label: "Macho", value: "M" },
                    { label: "Fêmea", value: "F" },
                    { label: "Castrado", value: "C" },
                  ].map((opcao) => (
                    <label key={opcao.value} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="sexo"
                        value={opcao.value}
                        checked={form.sexo === opcao.value}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm">{opcao.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de nascimento
                </label>
                <input
                  type="date"
                  name="data_nascimento"
                  value={form.data_nascimento}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto do animal:
              </label>
              <label className="relative flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                {fotoPreview ? (
                  <img src={fotoPreview} alt="Preview do pet" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="text-[10px] text-gray-500 text-center px-1">
                    Adicionar foto<br />PNG, JPG ou JPEG
                  </span>
                )}
                <input
                  type="file"
                  name="foto"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Informações adicionais
              </label>
              <input
                type="text"
                name="detalhes"
                value={form.detalhes}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {erro && <p className="text-sm text-red-600">{erro}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setForm({ nome: "", especie: "", raca: "", idade: "", sexo: "", data_nascimento: "", detalhes: "", cliente_id: form.cliente_id, foto: null });
                  setFotoPreview(null);
                }}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition"
              >
                {loading ? "Salvando..." : "Salvar cadastro"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
