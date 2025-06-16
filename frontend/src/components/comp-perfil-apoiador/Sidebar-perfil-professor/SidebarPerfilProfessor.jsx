import React from 'react';
import { FaUser, FaUsers, FaBars, FaTimes } from 'react-icons/fa'; // FaUsers para turmas
import './SidebarPerfilProfessor.css';

const SidebarPerfilProfessor = ({ setSecaoAtiva, secaoAtiva, isMobileOpen, toggleMobileMenu }) => {
  const handleNavigation = (section) => {
    setSecaoAtiva(section);
    if (window.innerWidth < 768) { // Fechar menu apenas em dispositivos móveis
      toggleMobileMenu();
    }
  };

  return (
    <>
      {/* Botão de Hambúrguer - apenas visível em dispositivos móveis */}
      <div className="hamburger-menu-professor d-md-none">
        <button
          className="hamburger-button-professor"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar - sempre visível em desktop, condicionalmente visível em mobile */}
      <div className={`sidebar-perfil-professor ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="d-flex d-md-none justify-content-end w-100 p-2">
          <button className="close-button-professor" onClick={toggleMobileMenu}>
            <FaTimes />
          </button>
        </div>
        <div className="sidebar-links-professor">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("dados");
            }}
            className={secaoAtiva === "dados" ? "active" : ""}
          >
            <FaUser /> Dados Pessoais
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("turmas");
            }}
            className={secaoAtiva === "turmas" ? "active" : ""}
          >
            <FaUsers /> Turmas / Chamada
          </a>
        </div>
      </div>

      {/* Overlay para fechar o menu ao clicar fora (apenas visível em mobile quando o menu está aberto) */}
      {isMobileOpen && (
        <div className="sidebar-overlay-professor d-md-none" onClick={toggleMobileMenu}></div>
      )}
    </>
  );
};

export default SidebarPerfilProfessor;