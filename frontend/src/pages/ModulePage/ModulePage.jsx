import { Link, useNavigate } from "react-router-dom";

const modules = {
  servicos: ["Serviços", "O catálogo de serviços será conectado quando o endpoint correspondente for disponibilizado pela API."],
  agendamentos: ["Agendamentos", "O gerenciamento de agendamentos está reservado para a próxima etapa da API."],
  atendimentos: ["Atendimentos", "O histórico de atendimentos será integrado à API em uma próxima etapa."],
  financeiro: ["Financeiro", "O módulo financeiro ainda não possui persistência no backend atual."],
  usuarios: ["Usuários", "A autenticação já está disponível; o gerenciamento administrativo de usuários será expandido."],
  permissoes: ["Permissões", "As permissões atuais são aplicadas pelo perfil do JWT. A tela detalhada será expandida."],
};

export default function ModulePage() {
  const { pathname } = window.location;
  const module = pathname.replace("/", "");
  const navigate = useNavigate();
  const [title, description] = modules[module] || ["Módulo", "Módulo não encontrado."];
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-semibold text-slate-800">{title}</h1><p className="mt-3 text-sm leading-6 text-slate-500">{description}</p><div className="mt-6 flex justify-center gap-3"><button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">Voltar</button><Link to="/dashboard/adm" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Dashboard</Link></div></section></main>;
}
