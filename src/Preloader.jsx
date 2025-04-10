import React from "react";
import logo from "src/Assets/Card4.png"; // Caminho da imagem

const Preloader = () => (
  <div className="preloader d-flex justify-content-center align-items-center flex-column">
    <img src={logo} alt="Carregando..." width={200} />
    <div className="mt-4 spinner-border text-light" role="status">
      <span className="visually-hidden">Carregando...</span>
    </div>
  </div>
);

export default Preloader;
