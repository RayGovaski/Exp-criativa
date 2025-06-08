// Perfil.jsx
import React, { useState } from "react";
import SidebarPerfil from "../../components/comp-perfil-apoiador/sidebar-perfil-apoiador/SidebarPerfil";
import DadosPessoais from "../../components/comp-perfil-apoiador/dados-pessoais/DadosPessoais";
import RelatoriosPerfil from "../../components/comp-perfil-apoiador/relatorio-perfil/RelatoriosPerfil";
import ComprovantesPerfil from "../../components/comp-perfil-apoiador/comprovantePerfil/ComprovantesPerfil";
import GerenciarAssinatura from "../../components/comp-perfil-apoiador/gerenciar-assinatura/GerenciarAssinatura";
import DeletarConta from "../../components/comp-perfil-apoiador/deletar-perfil/DeletarConta";
import "./Perfil.css";

const Perfil = () => {
  const [secaoAtiva, setSecaoAtiva] = useState("dados");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderConteudo = () => {
    switch (secaoAtiva) {
      case "dados":
        return <DadosPessoais />;
      case "relatorios":
        return <RelatoriosPerfil />;
      case "comprovantes":
        return <ComprovantesPerfil />;
      case "assinatura":
        return <GerenciarAssinatura />;
      case "deletar":
        return <DeletarConta />;
      default:
        return <DadosPessoais />;
    }
  };

  return (
    <div className="perfil-bg">
      <div className="perfil-container">
        <SidebarPerfil 
          setSecaoAtiva={setSecaoAtiva} 
          secaoAtiva={secaoAtiva} 
          isMobileOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />
        <div className={`perfil-conteudo ${isMobileMenuOpen ? 'blur-background' : ''}`}>
          <div className="page-title d-md-none mb-4">
            <h4 className="label-azul mb-0 page-title-text">
              {secaoAtiva === "dados"}
              {secaoAtiva === "relatorios"}
              {secaoAtiva === "comprovantes"}
              {secaoAtiva === "assinatura"}
              {secaoAtiva === "deletar"}
            </h4>
          </div>
          {renderConteudo()}
        </div>
      </div>
    </div>
  );
};

export default Perfil;