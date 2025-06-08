import React from "react";
import "./Footer.css"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid px-0">
        <div className="footer-content">
          <div className="footer-logos">
            <a className="footer-logo-left" href="#">
              <img src="src/Assets/logo.svg" alt="Logo Esquerda" className="footer-logo-img" />
            </a>
            <div className="footer-text-with-line">
              <div className="footer-text">
                <p className="footer-title">Trabalho de Experiência</p>
                <p className="footer-names">Ray Govaski, Luana Akemi, Thais Amaral, Maria E. Melo</p>
                <div className="footer-line"></div>
              </div>
              
            </div>
            <a className="footer-logo-right" href="#">
              <img src="src/Assets/logo.svg" alt="Logo Direita" className="footer-logo-img" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
