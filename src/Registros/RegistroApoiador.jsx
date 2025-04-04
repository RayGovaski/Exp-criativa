import React from "react";
import "./RegistroApoiador.css";

const RegistroApoiador = () => {
  return (
    <div className="d-flex justify-content-center align-items-center fundo-azul" style={{ minHeight: "100vh" }}>
      <div className="registro-container-azul">
        <div className="registro-header-azul">
          
        </div >
        <div class="title-container-azul">
          <h3 class="text-center-azul">Registro de Apoiador</h3>
          <div class="footer-line2-azul"></div>
        </div>
        <form className="registro-form-azul p-3">
        
          <div className="mb-2">
            <label className="label-azul">Nome completo:</label>
            <input type="text" />
          </div>
          <div className="mb-2">
            <label className="label-azul">CPF:</label>
            <input type="text" />
          </div>
          <div className="mb-2">
            <label className="label-azul">Email:</label>
            <input type="email" />
          </div>
          <div className="mb-2">
            <label className="label-azul">Senha:</label>
            <input type="password" />
          </div>
          <div className="mb-2">
            <label className="label-azul">Confirmar senha:</label>
            <input type="password" />
          </div>
          <div className="mb-2">
            <label className="label-azul">Data de nascimento:</label>
            <input type="date" />
          </div>
          <div className="mb-2">
            <label className="label-azul">Telefone:</label>
            <input type="text" />
          </div>
          <div className="button-container-azul">
           <button type="submit" class='custom-button-azul'>Registrar</button> 
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default RegistroApoiador;
