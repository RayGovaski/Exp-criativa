import React, { useState, useEffect, useRef } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { useNavigate } from "react-router-dom"; // Importar useNavigate para redirecionamento
import { useAuth } from '../../context/AuthContext'; // Importar useAuth
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth(); // Usar o hook useAuth para obter o status de autenticação e a função logout
  const navigate = useNavigate(); // Hook para navegação

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showDoarDropdown, setShowDoarDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Create refs to detect clicks outside the dropdowns
  const profileDropdownRef = useRef(null);
  const doarDropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Add event listener for clicks on the document
    const handleClickOutside = (event) => {
      // Close profile dropdown when clicking outside
      if (profileDropdownRef.current && 
          !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      
      // Close doar dropdown when clicking outside
      if (doarDropdownRef.current && 
          !doarDropdownRef.current.contains(event.target)) {
        setShowDoarDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdowns when route changes
  useEffect(() => {
    const closeDropdowns = () => {
      setShowProfileDropdown(false);
      setShowDoarDropdown(false);
    };
    
    // Listen for route changes (this is a simplified approach)
    // For react-router-dom v6+, consider using useLocation for more robust route change detection
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
  
  // New function to close all dropdowns
  const closeAllDropdowns = () => {
    setShowProfileDropdown(false);
    setShowDoarDropdown(false);
  };

  const handleLogoutClick = () => {
    closeAllDropdowns(); // Fecha os dropdowns antes de deslogar
    logout(); // Chama a função logout do AuthContext
    navigate('/'); // Redireciona para a home ou página de login após o logout (o logout já deve fazer isso, mas é uma segurança)
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
          {/* Botões do sidebar baseados no status de autenticação */}
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
                <Link to="/perfil" className="sidebar-link" onClick={closeSidebar}>
                  Meu Perfil
                </Link>
              </li>
              <li className="sidebar-item">
                <button 
                  className="sidebar-link logout-button" // Adicione uma classe para estilização, se necessário
                  onClick={() => { closeSidebar(); handleLogoutClick(); }}
                >
                  Sair
                </button>
              </li>
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
                <Link className="nav-link nav-item-custom4" to="/perfil"> {/* Contato -> Perfil? Verifique a rota correta */}
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
                  {!isAuthenticated() ? ( // Renderização condicional para os botões do perfil
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
                  ) : (
                    <>
                      <Link 
                        to="/perfil" // Rota para a página de perfil do usuário
                        className="dropdown-item-custom" 
                        onClick={closeAllDropdowns}
                      >
                        Meu Perfil
                      </Link>
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