import React from "react";
import "./Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid px-0">
        <a className="navbar-brand me-3" href="#">
          <img src="src/Assets/logo.svg" alt="Logo" className="navbar-logo" />
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link nav-item-custom" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-item-custom2" href="#">Sobre</a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-item-custom3" href="#">Apoie</a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-item-custom4" href="#">Contato</a>
            </li>
          </ul>
        </div>

        <div className="profile-container">
          <img src="src/Assets/Perfil.svg" alt="Perfil" className="profile-img" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
