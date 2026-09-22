import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import DashboardAdm from "./pages/Dashboard_Adm/Dashoboard_adm";
import DashboardCliente from "./pages/Dashboard_Cliente_animais/Dashboard_Cliente_animais";
import ListagemAnimaisAdm from "./pages/Listagem_Animais_Adm/Listagem_Animais_Adm";
import ListagemClientesAdm from "./pages/Listagem_Clientes_Adm/Listagem_Cliente_Adm";
import CadastroAnimal from "./pages/cadastro_animal/cadastro_animal";
import AtualizarAnimal from "./pages/Atualizar_cadastro/Atualizar_cadastro";
import AnimalDetalhes from "./pages/Detalhes/Detalhes";
import Contato from "./pages/Contato/Contato";
import ModulePage from "./pages/ModulePage/ModulePage";

function RotaProtegida({ children, perfil }) {
  const token = localStorage.getItem("token");
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  } catch {
    localStorage.removeItem("usuario");
  }

  if (!token || (perfil && usuario?.perfil !== perfil)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/servicos" element={<RotaProtegida perfil="ADM"><ModulePage /></RotaProtegida>} />
        <Route path="/agendamentos" element={<RotaProtegida perfil="ADM"><ModulePage /></RotaProtegida>} />
        <Route path="/atendimentos" element={<RotaProtegida perfil="ADM"><ModulePage /></RotaProtegida>} />
        <Route path="/financeiro" element={<RotaProtegida perfil="ADM"><ModulePage /></RotaProtegida>} />
        <Route path="/usuarios" element={<RotaProtegida perfil="ADM"><ModulePage /></RotaProtegida>} />
        <Route path="/permissoes" element={<RotaProtegida perfil="ADM"><ModulePage /></RotaProtegida>} />
        <Route
          path="/dashboard/adm"
          element={
            <RotaProtegida perfil="ADM">
              <DashboardAdm />
            </RotaProtegida>
          }
        />
        <Route
          path="/dashboard/cliente"
          element={
            <RotaProtegida perfil="CLIENTE">
              <DashboardCliente />
            </RotaProtegida>
          }
        />
        <Route
          path="/animais"
          element={
            <RotaProtegida perfil="ADM">
              <ListagemAnimaisAdm />
            </RotaProtegida>
          }
        />
        <Route
          path="/clientes"
          element={
            <RotaProtegida perfil="ADM">
              <ListagemClientesAdm />
            </RotaProtegida>
          }
        />
        <Route
          path="/animais/cadastro"
          element={
            <RotaProtegida>
              <CadastroAnimal />
            </RotaProtegida>
          }
        />
        <Route
          path="/animais/:id"
          element={
            <RotaProtegida>
              <AnimalDetalhes />
            </RotaProtegida>
          }
        />
        <Route
          path="/animais/:id/editar"
          element={
            <RotaProtegida>
              <AtualizarAnimal />
            </RotaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App