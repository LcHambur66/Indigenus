import React from "react";

export default function AnimalDetalhes() {
  return (
        
        <div className="grid min-h-[760px] grid-cols-1 md:grid-cols-[230px_1fr]">
          <aside className="hidden border-r border-[#eef0f6] bg-[#f7f8fc] px-4 py-[22px] md:block">
            <a href="#" className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-[#eef2ff]">
              ⌂ Dashboard
            </a>
            <div className="mt-[18px] mb-2 px-3 text-[11px] font-bold tracking-[0.08em] text-[#9aa3b2]">
              CADASTROS
            </div>
            <a href="#" className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-[#eef2ff]">
              👤 Clientes
            </a>
            <a href="#" className="flex items-center gap-2.5 rounded-[10px] bg-[#eef2ff] px-3 py-2.5 text-sm font-medium text-[#4f6ef7]">
              🐾 Animais
            </a>
            <a href="#" className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-[#eef2ff]">
              ✂ Serviços
            </a>
            <div className="mt-[18px] mb-2 px-3 text-[11px] font-bold tracking-[0.08em] text-[#9aa3b2]">
              GERENCIAMENTO
            </div>
            <a href="#" className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-[#eef2ff]">
              📅 Agendamentos
            </a>
            <a href="#" className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-[#eef2ff]">
              ▤ Atendimentos
            </a>
            <a href="#" className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-[#eef2ff]">
              $ Financeiro
            </a>
            <a href="#" className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-[#eef2ff]">
              👥 Usuários
            </a>
            <a href="#" className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-[#eef2ff]">
              ◎ Permissões
            </a>
            <a href="#" className="mt-[18px] flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-[#eef2ff]">
              ← Sair
            </a>
          </aside>

          <main className="px-8 pt-7 pb-10">
            <div className="mb-[22px] flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 text-[13px] text-gray-500">
                  <a href="#" className="text-[#4f6ef7] no-underline">Animais</a> / Detalhes
                </div>
                <h1 className="text-2xl font-bold">Dados completos do animal</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Visualize as informações do pet e do proprietário.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="whitespace-nowrap rounded-[10px] bg-[#f3f4f8] px-3 py-2 text-xs text-gray-500">
                  📅 15 de Setembro de 2026
                </div>
                <a href="#" className="inline-flex items-center gap-2 rounded-[10px] bg-[#eef2ff] px-4 py-2.5 text-sm font-semibold text-[#4f6ef7] no-underline">
                  ← Voltar
                </a>
                <button type="button" className="inline-flex items-center gap-2 rounded-[10px] bg-[#8b6cf6] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95">
                  ✎ Editar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-2xl border border-[#eef0f6] bg-white p-[22px] shadow-[0_6px_20px_rgba(79,110,247,0.04)]">
                <h2 className="mb-4 flex items-center gap-2.5 text-base font-semibold">
                  🐾 Animal
                  <span className="rounded-full bg-[#ecfdf3] px-2 py-1 text-[11px] font-bold text-[#16a34a]">
                    Ativo
                  </span>
                </h2>
                <div className="mb-[18px] flex items-center gap-[18px]">
                  <div className="grid h-[92px] w-[92px] shrink-0 place-items-center rounded-[20px] bg-gradient-to-b from-[#ede9fe] to-[#ddd6fe] text-[42px]">
                    🐶
                  </div>
                  <div>
                    <h3 className="text-[22px] font-semibold">Thor</h3>
                    <p className="text-sm leading-relaxed text-gray-500">
                      <strong className="text-gray-800">ID:</strong> ANI-0194
                      <br />
                      Golden Retriever · Macho · 4 anos
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#8b93a7]">Espécime</label>
                    <p className="rounded-[10px] bg-[#f7f8fc] px-3 py-2.5 text-sm">Canino</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#8b93a7]">Raça</label>
                    <p className="rounded-[10px] bg-[#f7f8fc] px-3 py-2.5 text-sm">Golden Retriever</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#8b93a7]">Sexo</label>
                    <p className="rounded-[10px] bg-[#f7f8fc] px-3 py-2.5 text-sm">Macho</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#8b93a7]">Porte</label>
                    <p className="rounded-[10px] bg-[#f7f8fc] px-3 py-2.5 text-sm">Grande</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#8b93a7]">Data de nascimento</label>
                    <p className="rounded-[10px] bg-[#f7f8fc] px-3 py-2.5 text-sm">12/03/2022</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#8b93a7]">Peso</label>
                    <p className="rounded-[10px] bg-[#f7f8fc] px-3 py-2.5 text-sm">28,4 kg</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#8b93a7]">Cor / pelagem</label>
                    <p className="rounded-[10px] bg-[#f7f8fc] px-3 py-2.5 text-sm">Dourado</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#8b93a7]">Microchip</label>
                    <p className="rounded-[10px] bg-[#f7f8fc] px-3 py-2.5 text-sm">981 000 123 456 789</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-[#8b93a7]">Observações</label>
                    <p className="rounded-[10px] bg-[#f7f8fc] px-3 py-2.5 text-sm">
                      Alérgico a alguns shampoos com perfume. Vacinas em dia. Muito sociável.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[#eef0f6] bg-white p-[22px] shadow-[0_6px_20px_rgba(79,110,247,0.04)]">
                <h2 className="mb-4 flex items-center gap-2.5 text-base font-semibold">
                  👤 Dados do proprietário
                </h2>
                <div className="mb-4 flex items-center gap-3.5">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#dbeafe] font-bold text-[#2563eb]">
                    MS
                  </div>
                  <div>
                    <strong>Mariana Silva</strong>
                    <p className="text-sm text-gray-500">Cliente #128 · Cadastro ativo</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#8b93a7]">CPF</label>
                    <p className="rounded-[10px] bg-[#f7f8fc] px-3 py-2.5 text-sm">123.456.789-00</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#8b93a7]">Telefone</label>
                    <p className="rounded-[10px] bg-[#f7f8fc] px-3 py-2.5 text-sm">(11) 98888-1234</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-[#8b93a7]">E-mail</label>
                    <p className="rounded-[10px] bg-[#f7f8fc] px-3 py-2.5 text-sm">mariana.silva@email.com</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-[#8b93a7]">Endereço</label>
                    <p className="rounded-[10px] bg-[#f7f8fc] px-3 py-2.5 text-sm">
                      Rua das Palmeiras, 245 — Jardim América, São Paulo/SP
                    </p>
                  </div>
                </div>
                
              </section>

              <section className="col-span-1 mt-[18px] rounded-2xl border border-[#eef0f6] bg-white p-[22px] shadow-[0_6px_20px_rgba(79,110,247,0.04)] lg:col-span-2">
                <h2 className="mb-4 flex items-center gap-2.5 text-base font-semibold">
                  📋 Últimos atendimentos
                </h2>
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr>
                      <th className="border-b border-[#eef0f6] py-2 text-left font-semibold text-[#8b93a7]">Data</th>
                      <th className="border-b border-[#eef0f6] py-2 text-left font-semibold text-[#8b93a7]">Serviço</th>
                      <th className="border-b border-[#eef0f6] py-2 text-left font-semibold text-[#8b93a7]">Profissional</th>
                      <th className="border-b border-[#eef0f6] py-2 text-left font-semibold text-[#8b93a7]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-b border-gray-100 py-2.5">02/09/2026</td>
                      <td className="border-b border-gray-100 py-2.5">Banho e tosa higiênica</td>
                      <td className="border-b border-gray-100 py-2.5">Ana Costa</td>
                      <td className="border-b border-gray-100 py-2.5">Concluído</td>
                    </tr>
                    <tr>
                      <td className="border-b border-gray-100 py-2.5">18/08/2026</td>
                      <td className="border-b border-gray-100 py-2.5">Consulta veterinária</td>
                      <td className="border-b border-gray-100 py-2.5">Dr. Paulo Mendes</td>
                      <td className="border-b border-gray-100 py-2.5">Concluído</td>
                    </tr>
                    <tr>
                      <td className="border-b border-gray-100 py-2.5">05/07/2026</td>
                      <td className="border-b border-gray-100 py-2.5">Vacina V10</td>
                      <td className="border-b border-gray-100 py-2.5">Dra. Helena Dias</td>
                      <td className="border-b border-gray-100 py-2.5">Concluído</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </div>
          </main>
        </div>
  );
}