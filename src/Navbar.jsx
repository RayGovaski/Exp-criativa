import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Navbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showDoarDropdown, setShowDoarDropdown] = useState(false);

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowDoarDropdown(false); // Fecha o outro dropdown se estiver aberto
  };

  const toggleDoarDropdown = () => {
    setShowDoarDropdown(!showDoarDropdown);
    setShowProfileDropdown(false); // Fecha o outro dropdown se estiver aberto
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid px-0">
        <Link to="/" className="navbar-brand me-3">
          <img src="src/Assets/logo.svg" alt="Logo" className="navbar-logo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

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
                <Link to="/registro" className="dropdown-item-custom">
                  Registro
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;