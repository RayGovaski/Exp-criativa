// src/components/navbar/Navbar.jsx

import React, { useState, useEffect, useRef } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext'; 
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth(); // 'user' agora tem perfil completo + role
  const navigate = useNavigate();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showDoarDropdown, setShowDoarDropdown] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const profileDropdownRef = useRef(null);
  const doarDropdownRef = useRef(null);

  // URLs base para buscar as fotos de perfil por tipo de usuário
  // ASSUMA que estas rotas existem e que o backend serve as fotos por ID
  const PHOTO_BASE_URLS = {
    apoiador: 'http://localhost:8000/apoiador/foto/',
    aluno: 'http://localhost:8000/alunos/foto/',
    professor: 'http://localhost:8000/professores/foto/', // Crie esta rota no seu backend
    administrador: 'http://localhost:8000/administradores/foto/', // Crie esta rota no seu backend
  };

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

  // Função para obter a URL da imagem do perfil
  const getProfileImageUrl = () => {
    // Se não há usuário logado ou o objeto user está incompleto
    if (!user || !user.id || !user.role) {
      return "src/Assets/Perfil.svg"; // Fallback: imagem padrão
    }

    // user.foto_path agora virá do perfil completo buscado pelo AuthContext
    if (user.foto_path) {
        const baseUrl = PHOTO_BASE_URLS[user.role];
        if (baseUrl) {
            // Constrói a URL usando a URL base específica da role e o ID do usuário
            return `${baseUrl}${user.id}?t=${new Date().getTime()}`; 
        }
    }
    // Se user.foto_path é nulo ou a base URL não foi encontrada para a role
    return "src/Assets/Perfil.svg"; // Fallback: imagem padrão
  };

  // Ajusta o link "Meu Perfil" e "Gerenciar Assinatura"
  const getProfileLinkByRole = () => {
    if (!user || !user.role) return '/login'; // Se não tiver role, vai para login
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
              {/* Adicionar Gerenciar Assinatura no sidebar se for apoiador */}
              {user && user.role === 'apoiador' && (
                  <li className="sidebar-item">
                      <Link to="/gerenciar-assinatura" className="sidebar-link" onClick={closeSidebar}>Gerenciar Assinatura</Link>
                  </li>
              )}
            </>
          )}
        </ul>
      </div>

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
                  <div className="dropdown-menu-custom show">
                    {isAuthenticated() && (
                      <Link to="/assinaturas" className="dropdown-item-custom" onClick={closeAllDropdowns}>Assinaturas</Link>
                    )}
                    <Link to="/doar" className="dropdown-item-custom" onClick={closeAllDropdowns}>Doar para causa</Link>
                  </div>
                )}
              </li>
              <li className="nav-item"><Link className="nav-link nav-item-custom4" to="/#contato">Contato</Link></li>
            </ul>
          </div>

          <div className="profile-container" ref={profileDropdownRef}>
            <div className="profile-dropdown-container">
              <img
                src={isAuthenticated() ? getProfileImageUrl() : "src/Assets/Perfil.svg"}
                alt="Perfil"
                className="profile-img"
                onClick={toggleProfileDropdown}
                onError={(e) => { e.target.onerror = null; e.target.src = "src/Assets/Perfil.svg"; }}
              />
              {showProfileDropdown && (
                <div className="profile-dropdown-menu show">
                  {!isAuthenticated() ? (
                    <>
                      <Link to="/login" className="dropdown-item-custom" onClick={closeAllDropdowns}>Login</Link>
                      <Link to="/menu-registro" className="dropdown-item-custom" onClick={closeAllDropdowns}>Registro</Link>
                    </>
                  ) : (
                    <>
                      <Link to={getProfileLinkByRole()} className="dropdown-item-custom" onClick={closeAllDropdowns}>Meu Perfil</Link>
                      <button className="dropdown-item-custom logout-button" onClick={handleLogoutClick}>Sair</button>
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