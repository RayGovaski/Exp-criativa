// PerfilADM.jsx
import React, { useState } from "react";
// Import placeholder components for admin sections
// IMPORTANT: Ensure all these files (SidebarPerfilADM.jsx, RelatoriosADM.jsx, CriarTurma.jsx,
// CriarCardDoacao.jsx, CriarPerfilProfessor.jsx, DeletarConta.jsx, and Perfil-adm.css)
// are in the SAME DIRECTORY as this PerfilADM.jsx file.
import SidebarPerfilADM from "../../../components/comp-perfil-apoiador/Sidebar-perfil-ADM/SidebarPerfilADM";
import RelatoriosADM from "../../../components/comp-perfil-apoiador/relatorio-perfil/RelatoriosADM";
import CriarTurma from "../../../components/comp-perfil-apoiador/CriarTurma/CriarTurma";
import CriarCardDoacao from "../../../components/comp-perfil-apoiador/criarDoacaoAdm/CriarCardDoacao";
import CriarPerfilProfessor from "../../../components/comp-perfil-apoiador/CriarPerfilProfessor/CriarPerfilProfessor";

import "./Perfil-adm.css"; // Admin-specific CSS

const PerfilADM = () => {
  // State to manage which section is currently active, default to 'relatorios'
  const [secaoAtiva, setSecaoAtiva] = useState("relatorios");
  // State to manage the mobile menu's open/closed state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to toggle the mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Helper function to get the display title for the current active section
  const getSectionTitle = (section) => {
    switch (section) {
      case "relatorios":
        return "Relatórios Administrativos";
      case "criarTurma":
        return "Criar Turma";
      case "criarDoacao":
        return "Criar Card de Doação";
      case "criarProfessor":
        return "Criar Perfil de Professor";
      default:
        return "";
    }
  };

  // Function to render the content based on the active section
  const renderConteudo = () => {
    switch (secaoAtiva) {
      case "relatorios":
        return <RelatoriosADM />;
      case "criarTurma":
        return <CriarTurma />;
      case "criarDoacao":
        return <CriarCardDoacao />;
      case "criarProfessor":
        return <CriarPerfilProfessor />;
      case "deletar":
        return <DeletarConta />; // Reusing the existing DeletarConta component
      default:
        return <RelatoriosADM />; // Default to admin reports
    }
  };

  return (
    <div className="perfil-adm-bg"> {/* Background wrapper */}
      <div className="perfil-adm-container"> {/* Main content container */}
        {/* Sidebar component for navigation */}
        <SidebarPerfilADM
          setSecaoAtiva={setSecaoAtiva}
          secaoAtiva={secaoAtiva}
          isMobileOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />
        {/* Content area for the active section */}
        <div className={`perfil-adm-conteudo ${isMobileMenuOpen ? 'blur-background' : ''}`}>
          {/* Mobile view title for the current section */}
          <div className="page-title d-md-none mb-4">
            <h4 className="label-azul mb-0 page-title-text">
              {getSectionTitle(secaoAtiva)}
            </h4>
          </div>
          {/* Render the content of the active section */}
          {renderConteudo()}
        </div>
      </div>
    </div>
  );
};

export default PerfilADM;
