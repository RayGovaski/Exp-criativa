import React from "react";
import { useNavigate } from "react-router-dom";
import "./MenuRegistro.css";

const MenuRegistro = () => {
  const navigate = useNavigate(); 

  const handleRegistroTipo = (tipo) => {
    if (tipo === "apoiador") {
      navigate("/registro-apoiador"); 
    } else if (tipo === "aluno") {
      navigate("/registro-aluno");
    }
  };

  return (
    <div className="fundo-menu">
      <div className="menu-container">
        <div className="content-wrapper">
          <h2 className="menu-title">Registre-se aqui!</h2>
          <div className="menu-options">
            <button className="menu-button apoiador" onClick={() => handleRegistroTipo("apoiador")}>
              <img src="src/Assets/LogoApoiador.svg" alt="Ícone Apoiador" className="menu-icon" />
              <span className="menu-text">Seja um Apoiador</span>
            </button>
            <button className="menu-button aluno" onClick={() => handleRegistroTipo("aluno")}>
              <img src="src/Assets/LogoAluno.svg" alt="Ícone Aluno" className="menu-icon" />
              <span className="menu-text">Seja um Aluno</span>
            </button>
          </div>
          <p className="menu-login">Faça seu <a href="/login">login aqui</a></p>
        </div>
      </div>
    </div>
  );
};

export default MenuRegistro;
