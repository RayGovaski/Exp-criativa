import React from 'react';
// ✅ CORREÇÃO 1: Adicionado FaSignOutAlt à lista de ícones importados
import { FaUser, FaUsers, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import './SidebarPerfilProfessor.css';
// ✅ CORREÇÃO 2: Importado o useAuth para obter a função de logout
import { useAuth } from '../../../context/AuthContext'; // Verifique se este caminho está correto

const SidebarPerfilProfessor = ({ setSecaoAtiva, secaoAtiva, isMobileOpen, toggleMobileMenu }) => {
  
  // ✅ CORREÇÃO 3: Chamado o hook useAuth para pegar a função logout
  const { logout } = useAuth();

  const handleNavigation = (section) => {
    setSecaoAtiva(section);
    if (window.innerWidth < 768) {
      toggleMobileMenu();
    }
  };

  const handleLogoutClick = () => {
    console.log('DEBUG [SidebarPerfilProfessor]: Botão "Sair" clicado.');
    if (window.innerWidth < 768) {
      toggleMobileMenu();
    }
    logout(); // Agora a função logout está definida
  };

  return (
    <>
      {/* Botão de Hambúrguer */}
      <div className="hamburger-menu-professor d-md-none">
        <button
          className="hamburger-button-professor"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
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
          <a
             className="sidebar-logout-button-aluno" // Mantive a classe, você pode renomear se quiser
             onClick={handleLogoutClick}
          >
            <FaSignOutAlt /> Sair
          </a>
        </div>
      </div>

      {/* Overlay */}
      {isMobileOpen && (
        <div className="sidebar-overlay-professor d-md-none" onClick={toggleMobileMenu}></div>
      )}
    </>
  );
};

export default SidebarPerfilProfessor;