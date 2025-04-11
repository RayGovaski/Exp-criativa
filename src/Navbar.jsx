import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Navbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showDoarDropdown, setShowDoarDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta quando a tela é mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    
    handleResize(); // Verifica no carregamento inicial
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
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
    // Fecha os outros dropdowns quando abre a sidebar
    setShowDoarDropdown(false);
    setShowProfileDropdown(false);
  };

  // Fecha a sidebar ao clicar em um link
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Overlay que cobre a tela quando o sidebar está aberto */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
      
      {/* Sidebar para dispositivos móveis */}
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
            <Link to="/sobre" className="sidebar-link" onClick={closeSidebar}>
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
            <Link to="/contato" className="sidebar-link" onClick={closeSidebar}>
              Contato
            </Link>
          </li>
        </ul>
      </div>

      {/* Navbar principal */}
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid navbar-container">
          {/* Hamburger em mobile */}
          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Logo no centro em mobile, normal em desktop */}
          <Link to="/" className={`navbar-brand ${isMobile ? 'mx-auto' : 'me-3'}`}>
            <img src="src/Assets/logo.svg" alt="Logo" className="navbar-logo" />
          </Link>

          {/* Menu normal para desktop */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link nav-item-custom" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-item-custom2" to="/sobre">
                  Sobre
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link 
                  className="nav-link nav-item-custom3" 
                  onClick={toggleDoarDropdown}
                  style={{ cursor: 'pointer' }}
                >
                  Apoie {showDoarDropdown ? '▲' : '▼'}
                </Link>
                {showDoarDropdown && (
                  <div className="dropdown-menu-custom show">
                    <Link to="/assinaturas" className="dropdown-item-custom">
                      Assinaturas
                    </Link>
                    <Link to="/doar" className="dropdown-item-custom">
                      Doar para causa
                    </Link>
                  </div>
                )}
              </li>
              <li className="nav-item">
                <Link className="nav-link nav-item-custom4" to="/contato">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Foto de perfil sempre à direita */}
          <div className="profile-container">
            <div className="profile-dropdown-container">
              <img 
                src="src/Assets/Perfil.svg" 
                alt="Perfil" 
                className="profile-img" 
                onClick={toggleProfileDropdown}
              />
              {showProfileDropdown && (
                <div className="profile-dropdown-menu show">
                  <Link to="/login" className="dropdown-item-custom">
                    Login
                  </Link>
                  <Link to="/menu-registro" className="dropdown-item-custom">
                    Registro
                  </Link>
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