import { useState } from "react";

export default function Contato() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnviado(false);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
          <div className="bg-teal-400 text-white p-6 sm:p-8 md:w-2/5 flex flex-col justify-center order-2 md:order-1">
            <span className="bg-white/20 text-xs font-medium px-3 py-1 rounded-full w-fit mb-4 sm:mb-6">
              CONTATO
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Fale conosco
            </h1>
            <p className="text-sm sm:text-base opacity-90 mb-4">
              Estamos aqui para ajudar você e seu companheiro.
            </p>
            <div className="w-12 h-0.5 bg-white mb-5"></div>

            <div className="space-y-3">
              <div className="bg-white/20 rounded-xl px-4 py-3">
                <p className="text-xs opacity-80 mb-0.5">Email</p>
                <p className="text-sm font-medium">contato@indigenuspet.com</p>
              </div>
              <div className="bg-white/20 rounded-xl px-4 py-3">
                <p className="text-xs opacity-80 mb-0.5">Telefone</p>
                <p className="text-sm font-medium">(11) 99999-9999</p>
              </div>
              <div className="bg-white/20 rounded-xl px-4 py-3">
                <p className="text-xs opacity-80 mb-0.5">Endereço</p>
                <p className="text-sm font-medium">São Paulo, SP - Brasil</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 md:p-8 md:w-3/5">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              Envie uma mensagem
            </h2>
            <p className="text-sm text-gray-500 mb-5 sm:mb-6">
              Preencha o formulário abaixo e entraremos em contato.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assunto
                </label>
                <input
                  type="text"
                  name="assunto"
                  value={form.assunto}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  name="mensagem"
                  value={form.mensagem}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setForm({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" })}
                  className="w-full sm:flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  Enviar mensagem
                </button>
              </div>
              {enviado && <p className="text-center text-sm text-green-600">Mensagem registrada. Entraremos em contato em breve.</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
