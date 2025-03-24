import React from "react";
import "./RegistroAluno.css";

const RegistroAluno = () => {
  return (
    <div className="d-flex justify-content-center align-items-center fundo-rosa" style={{ minHeight: "100vh" }}>
      <div className="registro-container-rosa">
        <div className="registro-header-rosa"></div>
        <div className="title-container">
          <h3 className="text-center-rosa">Cadastro de Aluno</h3>
          <div className="footer-line2-rosa"></div>
        </div>
        <form className="registro-form-rosa p-3">
          <div className="mb-2">
            <label className="label-rosa">Nome completo:</label>
            <input type="text" />
          </div>
          <div className="mb-2">
            <label className="label-rosa">Data de nascimento:</label>
            <input type="date" />
          </div>
          <div className="mb-2">
            <label className="label-rosa">Nome do Responsável:</label>
            <input type="text" />
          </div>
          <div className="mb-2">
            <label className="label-rosa">Telefone do Responsável:</label>
            <input type="text" />
          </div>
          <div className="mb-2">
            <label className="label-rosa">Email do Responsável:</label>
            <input type="email" />
          </div>
          <div className="mb-2">
            <label className="label-rosa">Senha:</label>
            <input type="password" />
          </div>
          <div className="mb-2">
            <label className="label-rosa">Confirmar senha:</label>
            <input type="password" />
          </div>
          <div className="mb-2">
            <label className="label-rosa">Endereço:</label>
            <input type="text" />
          </div>
          <div className="button-container-rosa">
            <button type="submit" className="custom-button-rosa">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroAluno;
