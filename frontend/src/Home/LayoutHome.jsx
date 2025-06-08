import React from "react";
import "./LayoutHome.css";

const LayoutHome = () => {
  return (
    <div className="layout-home">
      <div className="parallax-background"></div>
      <div className="content-container">
        <div className="text-content">
          <div className="sobre-titulo2">
            <h1 className="pipipi">SUA CONTRIBUIÇÃO FAZ TODA A DIFERENÇA!</h1> 
          </div>
          <p>
            Com a sua doação, conseguimos oferecer mais aulas, comprar materiais
            e instrumentos, e proporcionar um futuro melhor para as crianças.
            Junte-se a nós e ajude a transformar vidas por meio da cultura!
            Cada valor, independente de quanto, é um passo para mudar o amanhã.
            Faça parte dessa missão e ajude agora!
          </p>
        </div>
        <div className="button-container">
          <button className="quero-ajudar-button">Quero ajudar!</button>
        </div>
      </div>
    </div>
  );
};

export default LayoutHome;
