import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";


const Navbar = () => {
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
            <li className="nav-item">
              <Link className="nav-link nav-item-custom3" to="/apoie">
                Apoie
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-item-custom4" to="/contato">
                Contato
              </Link>
            </li>
          </ul>
        </div>

        <div className="profile-container">
          <Link to="/menu-registro">
            <img src="src/Assets/Perfil.svg" alt="Perfil" className="profile-img" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
