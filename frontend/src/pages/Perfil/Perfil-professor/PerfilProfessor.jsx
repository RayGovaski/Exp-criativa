import React, { useState } from "react";
import SidebarPerfilProfessor from "../../../components/comp-perfil-apoiador/Sidebar-perfil-professor/SidebarPerfilProfessor";
import DadosPessoaisProfessor from "../../../components/comp-perfil-apoiador/dados-pessoais/DadosPessoaisProfessor";
import TurmasChamadaProfessor from "../../../components/comp-perfil-apoiador/turmas-chamada-professor/TurmasChamadaProfessor";
// Importe o CSS específico do layout do perfil do professor
import "./PerfilProfessor.css";

const PerfilProfessor = () => {
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
      case "turmas":
        return "Minhas Turmas / Chamada";
      default:
        return "";
    }
  };

  const renderConteudo = () => {
    switch (secaoAtiva) {
      case "dados":
        return <DadosPessoaisProfessor />;
      case "turmas":
        return <TurmasChamadaProfessor />;
      default:
        return <DadosPessoaisProfessor />;
    }
  };

  return (
    <div className="perfil-professor-bg">
      <div className="perfil-professor-container">
        <SidebarPerfilProfessor
          setSecaoAtiva={setSecaoAtiva}
          secaoAtiva={secaoAtiva}
          isMobileOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />
        <div className={`perfil-professor-conteudo ${isMobileMenuOpen ? 'blur-background' : ''}`}>
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

export default PerfilProfessor;