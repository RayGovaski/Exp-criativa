import React from 'react';
import { FaUser, FaChartBar, FaBook, FaChalkboardTeacher, FaTrashAlt, FaBars, FaTimes } from 'react-icons/fa';
import './SidebarPerfilAluno.css'; // Don't forget to create this CSS file!

const SidebarPerfilAluno = ({ setSecaoAtiva, secaoAtiva, isMobileOpen, toggleMobileMenu }) => {
  const handleNavigation = (section) => {
    setSecaoAtiva(section);
    if (window.innerWidth < 768) { // Close menu only on mobile devices
      toggleMobileMenu();
    }
  };

  return (
    <>
      {/* Hamburger Button - only visible on mobile devices */}
      <div className="hamburger-menu-aluno d-md-none">
        <button
          className="hamburger-button-aluno"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar - always visible on desktop, conditionally visible on mobile */}
      <div className={`sidebar-perfil-aluno ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="d-flex d-md-none justify-content-end w-100 p-2">
          <button className="close-button-aluno" onClick={toggleMobileMenu}>
            <FaTimes />
          </button>
        </div>
        <div className="sidebar-links-aluno">
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
              handleNavigation("relatorios");
            }}
            className={secaoAtiva === "relatorios" ? "active" : ""}
          >
            <FaChartBar /> Faltas
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("materias");
            }}
            className={secaoAtiva === "materias" ? "active" : ""}
          >
            <FaBook /> Minhas Matérias
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("sala");
            }}
            className={secaoAtiva === "sala" ? "active" : ""}
          >
            <FaChalkboardTeacher /> Minha Sala
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

      {/* Overlay to close the menu when clicking outside (only visible on mobile when menu is open) */}
      {isMobileOpen && (
        <div className="sidebar-overlay-aluno d-md-none" onClick={toggleMobileMenu}></div>
      )}
    </>
  );
};

export default SidebarPerfilAluno;