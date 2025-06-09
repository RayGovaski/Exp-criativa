import React, { useState, useEffect, useRef } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showDoarDropdown, setShowDoarDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const profileDropdownRef = useRef(null);
  const doarDropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleClickOutside = (event) => {
      if (profileDropdownRef.current &&
          !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }

      if (doarDropdownRef.current &&
          !doarDropdownRef.current.contains(event.target)) {
        setShowDoarDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const closeDropdowns = () => {
      setShowProfileDropdown(false);
      setShowDoarDropdown(false);
    };

    window.addEventListener('hashchange', closeDropdowns);

    return () => {
      window.removeEventListener('hashchange', closeDropdowns);
    };
  }, []);

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowDoarDropdown(false);
  };

  const toggleDoarDropdown = () => {
    setShowDoarDropdown(!showDoarDropdown);
    setShowProfileDropdown(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setShowDoarDropdown(false);
    setShowProfileDropdown(false);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const closeAllDropdowns = () => {
    setShowProfileDropdown(false);
    setShowDoarDropdown(false);
  };

  const handleLogoutClick = () => {
    closeAllDropdowns();
    logout();
    navigate('/');
  };

  return (
    <>
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-close" onClick={toggleSidebar}>×</span>
        </div>
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <Link to="/" className="sidebar-link" onClick={closeSidebar}>
              Home
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/#sobre" className="sidebar-link" onClick={closeSidebar}>
              Sobre
            </Link>
          </li>
          <li className="sidebar-item dropdown">
            <div
              className={`sidebar-link dropdown-toggle ${showDoarDropdown ? 'active-dropdown' : ''}`}
              onClick={() => setShowDoarDropdown(!showDoarDropdown)}
            >
              Apoie {showDoarDropdown ? '' : ''}
            </div>
            {showDoarDropdown && (
              <div className="sidebar-dropdown">
                <Link to="/assinaturas" className="sidebar-dropdown-item" onClick={closeSidebar}>
                  Assinaturas
                </Link>
                <Link to="/doar" className="sidebar-dropdown-item" onClick={closeSidebar}>
                  Doar para causa
                </Link>
              </div>
            )}
          </li>
          <li className="sidebar-item">
            <Link to="/#contato" className="sidebar-link" onClick={closeSidebar}>
              Contato
            </Link>
          </li>
          {/* Botões do sidebar baseados no status de autenticação (mantido como estava) */}
          {!isAuthenticated() ? (
            <>
              <li className="sidebar-item">
                <Link to="/login" className="sidebar-link" onClick={closeSidebar}>
                  Login
                </Link>
              </li>
              <li className="sidebar-item">
                <Link to="/menu-registro" className="sidebar-link" onClick={closeSidebar}>
                  Registro
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="sidebar-item">
                <Link to="/perfil-aluno" className="sidebar-link" onClick={closeSidebar}> {/* Rota ajustada para perfil-aluno */}
                  Meu Perfil
                </Link>
              </li>
              {/* Opção de Sair do Sidebar é removida aqui, será apenas no dropdown do perfil */}
            </>
          )}
        </ul>
      </div>

      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid navbar-container">
          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <Link to="/" className={`navbar-brand ${isMobile ? 'mx-auto' : 'me-3'}`}>
            <img src="src/Assets/logo.svg" alt="Logo" className="navbar-logo" />
          </Link>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link nav-item-custom" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-item-custom2" to="/#sobre">
                  Sobre
                </Link>
              </li>
              <li className="nav-item dropdown" ref={doarDropdownRef}>
                <Link
                  className="nav-link nav-item-custom3"
                  onClick={toggleDoarDropdown}
                  style={{ cursor: 'pointer' }}
                >
                  Apoie {showDoarDropdown ? '▲' : '▼'}
                </Link>
                {showDoarDropdown && (
                  <div className="dropdown-menu-custom show">
                    <Link
                      to="/assinaturas"
                      className="dropdown-item-custom"
                      onClick={closeAllDropdowns}
                    >
                      Assinaturas
                    </Link>
                    <Link
                      to="/doar"
                      className="dropdown-item-custom"
                      onClick={closeAllDropdowns}
                    >
                      Doar para causa
                    </Link>
                  </div>
                )}
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-item-custom4" to="/perfil">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div className="profile-container" ref={profileDropdownRef}>
            <div className="profile-dropdown-container">
              <img
                src="src/Assets/Perfil.svg"
                alt="Perfil"
                className="profile-img"
                onClick={toggleProfileDropdown}
              />
              {showProfileDropdown && (
                <div className="profile-dropdown-menu show">
                  {!isAuthenticated() ? ( // Se NÃO autenticado
                    <>
                      <Link
                        to="/login"
                        className="dropdown-item-custom"
                        onClick={closeAllDropdowns}
                      >
                        Login
                      </Link>
                      <Link
                        to="/menu-registro"
                        className="dropdown-item-custom"
                        onClick={closeAllDropdowns}
                      >
                        Registro
                      </Link>
                    </>
                  ) : ( // Se AUTENTICADO
                    <>
                      <Link
                        to="/perfil" // Rota para a página de perfil do ALUNO
                        className="dropdown-item-custom"
                        onClick={closeAllDropdowns}
                      >
                        Meu Perfil
                      </Link>
                      {/* NOVO: Adicionado o botão "Sair" aqui */}
                      <button
                        className="dropdown-item-custom logout-button" // Usando button para o logout
                        onClick={handleLogoutClick}
                      >
                        Sair
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;