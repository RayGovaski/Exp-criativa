// src/components/navbar/Navbar.jsx

import React, { useState, useEffect, useRef } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'; 
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, User } from "lucide-react";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showDoarDropdown, setShowDoarDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const profileDropdownRef = useRef(null);
  const doarDropdownRef = useRef(null);

  // Componente do Toggle Switch
  const ThemeToggleSwitch = ({ onClick, isDark }) => (
    <button 
      className={`theme-toggle-switch ${isDark ? 'dark' : ''}`}
      onClick={onClick}
      aria-label="Alternar tema"
    >
      <div className="theme-toggle-slider">
        <Sun className="theme-icon sun-icon" />
        <Moon className="theme-icon moon-icon" />
      </div>
    </button>
  );

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
    console.log('DEBUG [Navbar]: Botão "Sair" clicado. Chamando logout do AuthContext.');
    closeAllDropdowns();
    logout(); 
  };

  const handleThemeToggle = () => {
    toggleTheme();
    closeAllDropdowns();
  };

  const handleThemeToggleSidebar = () => {
    toggleTheme();
    closeSidebar();
  };

  const getProfileLinkByRole = () => {
    if (!user || !user.role) return '/login';
    switch (user.role) {
      case 'apoiador': return '/perfil';
      case 'aluno': return '/perfil-aluno';
      case 'professor': return '/perfil-professor';
      case 'administrador': return '/perfil-adm';
      default: return '/login';
    }
  };

  return (
    <>
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar para Mobile */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-close" onClick={toggleSidebar}>×</span>
        </div>
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <Link to="/" className="sidebar-link" onClick={closeSidebar}>Home</Link>
          </li>
          <li className="sidebar-item">
            <Link to="/#sobre" className="sidebar-link" onClick={closeSidebar}>Sobre</Link>
          </li>
          <li className="sidebar-item dropdown">
            <div className={`sidebar-link dropdown-toggle ${showDoarDropdown ? 'active-dropdown' : ''}`}
                 onClick={() => setShowDoarDropdown(!showDoarDropdown)}>Apoie</div>
            {showDoarDropdown && (
              <div className="sidebar-dropdown">
                {isAuthenticated() && (
                  <Link to="/assinaturas" className="sidebar-dropdown-item" onClick={closeSidebar}>Assinaturas</Link>
                )}
                <Link to="/doar" className="sidebar-dropdown-item" onClick={closeSidebar}>Doar para causa</Link>
              </div>
            )}
          </li>
          <li className="sidebar-item">
            <Link to="/#contato" className="sidebar-link" onClick={closeSidebar}>Contato</Link>
          </li>
          
          {/* Toggle de Tema no Sidebar */}
          <li className="sidebar-item theme-toggle-item">
            <div className="theme-toggle-container">
              <ThemeToggleSwitch 
                onClick={handleThemeToggleSidebar} 
                isDark={theme === 'dark'} 
              />
            </div>
          </li>

          {!isAuthenticated() ? (
            <>
              <li className="sidebar-item"><Link to="/login" className="sidebar-link" onClick={closeSidebar}>Login</Link></li>
              <li className="sidebar-item"><Link to="/menu-registro" className="sidebar-link" onClick={closeSidebar}>Registro</Link></li>
            </>
          ) : (
            <>
              <li className="sidebar-item">
                <Link to={getProfileLinkByRole()} className="sidebar-link" onClick={closeSidebar}>Meu Perfil</Link> 
              </li>
              <li className="sidebar-item">
                <button className="sidebar-link logout-button" onClick={() => { handleLogoutClick(); closeSidebar(); }}>Sair</button>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Navbar principal */}
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid navbar-container">
          <button className="navbar-toggler border-0" type="button" onClick={toggleSidebar} aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <Link to="/" className={`navbar-brand ${isMobile ? 'mx-auto' : 'me-3'}`}>
            <img src="src/Assets/logo.svg" alt="Logo" className="navbar-logo" />
          </Link>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><Link className="nav-link nav-item-custom" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link nav-item-custom2" to="/#sobre">Sobre</Link></li>
              <li className="nav-item dropdown" ref={doarDropdownRef}>
                <Link className="nav-link nav-item-custom3" onClick={toggleDoarDropdown} style={{ cursor: 'pointer' }}>
                  Apoie {showDoarDropdown ? '▲' : '▼'}
                </Link>
                {showDoarDropdown && (
                  <div className={`dropdown-menu-custom show ${theme === 'dark' ? 'dark' : ''}`}>
                    {isAuthenticated() && (
                      <Link to="/assinaturas" className={`dropdown-item-custom ${theme === 'dark' ? 'dark' : ''}`} onClick={closeAllDropdowns}>Assinaturas</Link>
                    )}
                    <Link to="/doar" className={`dropdown-item-custom ${theme === 'dark' ? 'dark' : ''}`} onClick={closeAllDropdowns}>Doar para causa</Link>
                  </div>
                )}
              </li>
              <li className="nav-item"><Link className="nav-link nav-item-custom4" to="/#contato">Contato</Link></li>
            </ul>
          </div>

          <div className="profile-container" ref={profileDropdownRef}>
            <div className="profile-dropdown-container">
              {/* Sempre renderiza apenas o ícone, com cor baseada no tema */}
              <div 
                className={`profile-icon ${theme === 'dark' ? 'dark' : ''}`}
                onClick={toggleProfileDropdown}
              >
                <User size={28} />
              </div>
              
              {showProfileDropdown && (
                <div className={`profile-dropdown-menu show ${theme === 'dark' ? 'dark' : ''}`}>
                  {isAuthenticated() ? (
                    <>
                      <Link to={getProfileLinkByRole()} className={`dropdown-item-custom ${theme === 'dark' ? 'dark' : ''}`} onClick={closeAllDropdowns}>Meu Perfil</Link>
                      <button className={`dropdown-item-custom logout-button ${theme === 'dark' ? 'dark' : ''}`} onClick={handleLogoutClick}>Sair</button>
                      <hr className={`dropdown-divider-custom ${theme === 'dark' ? 'dark' : ''}`} />
                      
                      {/* Toggle de Tema no Dropdown */}
                      <div className={`dropdown-item-custom theme-toggle-item ${theme === 'dark' ? 'dark' : ''}`}>
                        <div className="theme-toggle-container">
                          <ThemeToggleSwitch 
                            onClick={handleThemeToggle} 
                            isDark={theme === 'dark'} 
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className={`dropdown-item-custom ${theme === 'dark' ? 'dark' : ''}`} onClick={closeAllDropdowns}>Login</Link>
                      <Link to="/menu-registro" className={`dropdown-item-custom ${theme === 'dark' ? 'dark' : ''}`} onClick={closeAllDropdowns}>Registro</Link>
                      <hr className={`dropdown-divider-custom ${theme === 'dark' ? 'dark' : ''}`} />
                      
                      {/* Toggle de Tema no Dropdown para usuários deslogados */}
                      <div className={`dropdown-item-custom theme-toggle-item ${theme === 'dark' ? 'dark' : ''}`}>
                        <div className="theme-toggle-container">
                          <ThemeToggleSwitch 
                            onClick={handleThemeToggle} 
                            isDark={theme === 'dark'} 
                          />
                        </div>
                      </div>
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