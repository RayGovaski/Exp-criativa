import React, { useState, useEffect, useRef } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'; // Importe o useAuth
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth(); // <--- Obtenha o 'user' do useAuth
  const navigate = useNavigate();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showDoarDropdown, setShowDoarDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const profileDropdownRef = useRef(null);
  const doarDropdownRef = useRef(null);

  // URL base do backend para a foto do perfil
  const PROFILE_PHOTO_BASE_URL = 'http://localhost:8000/apoiador/foto/';

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

  // Função para obter a URL da imagem do perfil
  const getProfileImageUrl = () => {
    if (user && user.id) {
      // Adiciona um timestamp para evitar cache e garantir que a imagem seja atualizada se mudar
      return `${PROFILE_PHOTO_BASE_URL}${user.id}?t=${new Date().getTime()}`;
    }
    // Retorna a imagem de perfil padrão se não houver usuário logado ou ID
    return "src/Assets/Perfil.svg";
  };

  // Ajusta o link "Meu Perfil" do sidebar para usar a rota /perfil que renderiza o Perfil.jsx
  const getProfileLink = () => {
    if (user && user.role === 'aluno') { // Exemplo: se houver role no seu user object
      return '/perfil-aluno';
    } else if (user && user.role === 'professor') {
      return '/perfil-professor';
    } else if (user && user.role === 'apoiador') { // Assumindo 'apoiador' para o seu Perfil.jsx
      return '/perfil';
    }
    return '/login'; // Fallback
  }

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
              Apoie
            </div>
            {showDoarDropdown && (
              <div className="sidebar-dropdown">
                {isAuthenticated() && (
                  <Link to="/assinaturas" className="sidebar-dropdown-item" onClick={closeSidebar}>
                    Assinaturas
                  </Link>
                )}
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
                {/* Link para o perfil no sidebar */}
                <Link to={getProfileLink()} className="sidebar-link" onClick={closeSidebar}> 
                  Meu Perfil
                </Link>
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
                    {isAuthenticated() && (
                      <Link
                        to="/assinaturas"
                        className="dropdown-item-custom"
                        onClick={closeAllDropdowns}
                      >
                        Assinaturas
                      </Link>
                    )}
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
                <Link className="nav-link nav-item-custom4" to="/#contato">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div className="profile-container" ref={profileDropdownRef}>
            <div className="profile-dropdown-container">
              {/* <--- IMAGEM DO PERFIL AQUI --- */}
              <img
                // Usa a URL da imagem do perfil se o usuário estiver autenticado, senão usa a padrão
                src={isAuthenticated() ? getProfileImageUrl() : "src/Assets/Perfil.svg"}
                alt="Perfil"
                className="profile-img" // Certifique-se de que esta classe CSS define largura/altura para a imagem
                onClick={toggleProfileDropdown}
                // Adiciona um manipulador de erro para carregar uma imagem padrão se a foto não for encontrada
                onError={(e) => { e.target.onerror = null; e.target.src = "src/Assets/Perfil.svg"; }}
              />
              {showProfileDropdown && (
                <div className="profile-dropdown-menu show">
                  {!isAuthenticated() ? (
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
                        to="/perfil" // <--- ROTA CORRIGIDA PARA O PERFIL DO APOIADOR (GERAL)
                        className="dropdown-item-custom"
                        onClick={closeAllDropdowns}
                      >
                        Meu Perfil
                      </Link>
                      {/* Link para Gerenciar Assinatura (se for um apoiador) */}
                      {user && user.role === 'apoiador' && (
                         <Link
                           to="/gerenciar-assinatura"
                           className="dropdown-item-custom"
                           onClick={closeAllDropdowns}
                         >
                           Gerenciar Assinatura
                         </Link>
                      )}
                      <button
                        className="dropdown-item-custom logout-button"
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