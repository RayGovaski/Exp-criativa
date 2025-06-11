// PerfilAluno.jsx
import React, { useState } from "react";
import SidebarPerfilAluno from "../../../components/comp-perfil-apoiador/sidebar-perfil-aluno/SidebarPerfilAluno";
import MateriasAluno from "../../../components/comp-perfil-apoiador/materias-aluno/MateriasAluno"; // Novo componente
import SalaAluno from "../../../components/comp-perfil-apoiador/sala-aluno/SalaAluno"; // Novo componente

import "./Perfil-aluno.css";
import DeletarConta from "../../../components/comp-perfil-apoiador/deletar-perfil/DeletarConta";
import RelatoriosPerfilAluno from "../../../components/comp-perfil-apoiador/relatorio-perfil/RelatoriosPerfilAluno";
import DadosPessoaisAluno from "../../../components/comp-perfil-apoiador/dados-pessoais/DadosPessoaisAluno";

const PerfilAluno = () => {
  const [secaoAtiva, setSecaoAtiva] = useState("dados"); // Seção padrão
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Helper function to get the title for the mobile view
  const getSectionTitle = (section) => {
    switch (section) {
      case "dados":
        return "Dados Pessoais";
      case "relatorios":
        return "Relatórios";
      case "materias":
        return "Minhas Matérias";
      case "sala":
        return "Minha Sala";
      case "deletar":
        return "Deletar Conta";
      default:
        return "";
    }
  };

  const renderConteudo = () => {
    switch (secaoAtiva) {
      case "dados":
        return <DadosPessoaisAluno />;
      case "relatorios":
        return <RelatoriosPerfilAluno />;
      case "materias":
        return <MateriasAluno />;
      case "sala":
        return <SalaAluno />;
      case "deletar":
        return <DeletarConta />;
      default:
        return <DadosPessoaisAluno />;
    }
  };

  return (
    <div className="perfil-aluno-bg"> {/* Novo nome de classe para o background */}
      <div className="perfil-aluno-container"> {/* Novo nome de classe para o container */}
        <SidebarPerfilAluno
          setSecaoAtiva={setSecaoAtiva}
          secaoAtiva={secaoAtiva}
          isMobileOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />
        <div className={`perfil-aluno-conteudo ${isMobileMenuOpen ? 'blur-background' : ''}`}>
          <div className="page-title d-md-none mb-4">
            <h4 className="label-azul mb-0 page-title-text">
              {getSectionTitle(secaoAtiva)}
            </h4>
          </div>
          {renderConteudo()}
        </div>
      </div>
    </div>
  );
};

export default PerfilAluno;