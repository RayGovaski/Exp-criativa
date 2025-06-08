// SidebarPerfil.jsx
import React from 'react';
import { FaUser, FaChartBar, FaFileAlt, FaCreditCard, FaTrashAlt, FaBars, FaTimes } from 'react-icons/fa';
import './SidebarPerfil.css';

const SidebarPerfil = ({ setSecaoAtiva, secaoAtiva, isMobileOpen, toggleMobileMenu }) => {
  const handleNavigation = (section) => {
    setSecaoAtiva(section);
    if (window.innerWidth < 768) { // Fechar menu apenas em dispositivos móveis
      toggleMobileMenu();
    }
  };

  return (
    <>
      {/* Botão de Hambúrguer - apenas visível em dispositivos móveis */}
      <div className="hamburger-menu d-md-none">
        <button 
          className="hamburger-button" 
          onClick={toggleMobileMenu} 
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar - sempre visível em desktop, condicionalmente visível em mobile */}
      <div className={`sidebar-perfil ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="d-flex d-md-none justify-content-end w-100 p-2">
          <button className="close-button" onClick={toggleMobileMenu}>
            <FaTimes />
          </button>
        </div>
        <div className="sidebar-links">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("dados");
            }}
            className={secaoAtiva === "dados" ? "active" : ""}
          >
            <FaUser /> Dados
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("relatorios");
            }}
            className={secaoAtiva === "relatorios" ? "active" : ""}
          >
            <FaChartBar /> Relatórios
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("comprovantes");
            }}
            className={secaoAtiva === "comprovantes" ? "active" : ""}
          >
            <FaFileAlt /> Comprovantes
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("assinatura");
            }}
            className={secaoAtiva === "assinatura" ? "active" : ""}
          >
            <FaCreditCard /> Assinatura
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("deletar");
            }}
            className={secaoAtiva === "deletar" ? "active" : ""}
          >
            <FaTrashAlt /> Deletar Conta
          </a>
        </div>
      </div>
      
      {/* Overlay para fechar o menu ao clicar fora (apenas visível em mobile quando o menu está aberto) */}
      {isMobileOpen && (
        <div className="sidebar-overlay d-md-none" onClick={toggleMobileMenu}></div>
      )}
    </>
  );
};

export default SidebarPerfil;