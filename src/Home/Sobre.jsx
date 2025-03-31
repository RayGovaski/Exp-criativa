import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sobre.css";

const Sobre = () => {
  return (
    <div className="container sobre-container">
      <h2 className="sobre-titulo">Sobre nós</h2>
      

      <div className="row align-items-center sobre-conteudo">
        <div className="col-md-6 text-center">
          <img src="src/Assets/Logo.svg" alt="Cores do Amanhã" className="sobre-imagem img-fluid" />
        </div>
        <div className="col-md-6 sobre-texto">
           <p>
            No <strong>Cores do Amanhã</strong>, acreditamos que a arte e a cultura podem transformar vidas! Nosso projeto nasceu com a missão de levar aulas de música, teatro e outras atividades para crianças e adolescentes em situação de vulnerabilidade social, proporcionando oportunidades de aprendizado, crescimento e diversão.
          </p>
          <p>
            Através da educação artística, ajudamos a desenvolver habilidades, fortalecer a autoestima e criar um futuro com mais cor e esperança para cada criança. Com o apoio de voluntários e doadores, seguimos construindo um amanhã melhor, cheio de possibilidades. Venha fazer parte dessa mudança!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
