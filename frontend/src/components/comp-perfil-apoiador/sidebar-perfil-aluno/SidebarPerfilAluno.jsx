import React from 'react';
import { FaUser, FaChartBar, FaBook, FaChalkboardTeacher, FaTrashAlt, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from "../../../context/ThemeContext";
import './SidebarPerfilAluno.css';

const SidebarPerfilAluno = ({ setSecaoAtiva, secaoAtiva, isMobileOpen, toggleMobileMenu }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleNavigation = (section) => {
    setSecaoAtiva(section);
    if (window.innerWidth < 768) { // Close menu only on mobile devices
      toggleMobileMenu();
    }
  };

  const handleLogoutClick = () => {
    console.log('DEBUG [SidebarPerfilAluno]: Botão "Sair" clicado. Chamando logout do AuthContext.');
    if (window.innerWidth < 768) {
      toggleMobileMenu(); // Close mobile menu first
    }
    logout();
  };

  const handleThemeToggle = () => {
    toggleTheme();
    if (window.innerWidth < 768) {
      toggleMobileMenu(); // Close mobile menu after theme change
    }
  };

  // Componente do Toggle Switch (mesmo da navbar)
  const ThemeToggleSwitch = ({ onClick, isDark }) => (
    <button 
      className={`theme-toggle-switch-aluno ${isDark ? 'dark' : ''}`}
      onClick={onClick}
      aria-label="Alternar tema"
    >
      <div className="theme-toggle-slider-aluno">
        <Sun className="theme-icon-aluno sun-icon" />
        <Moon className="theme-icon-aluno moon-icon" />
      </div>
    </button>
  );

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
      <div className={`sidebar-perfil-aluno ${isMobileOpen ? 'mobile-open' : ''} ${theme === 'dark' ? 'dark' : ''}`}>
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
          
          {/* Divisor */}
          <hr className={`sidebar-divider-aluno ${theme === 'dark' ? 'dark' : ''}`} />
          
          {/* Toggle de Tema */}
          <div className="sidebar-theme-toggle-aluno">
            <span className="theme-label-aluno">Tema</span>
            <ThemeToggleSwitch 
              onClick={handleThemeToggle} 
              isDark={theme === 'dark'} 
            />
          </div>
          
          {/* Botão Sair */}
          <button
            className="sidebar-logout-button-aluno"
            onClick={handleLogoutClick}
          >
            <FaSignOutAlt /> Sair
          </button>
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