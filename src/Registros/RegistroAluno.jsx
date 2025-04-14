import React from "react";
import "./RegistroAluno.css";
import { useState } from 'react'
import axios from 'axios' 
import { Link } from 'react-router-dom';


const Add = () => {

  const [alunos, setAlunos] = useState({ 
    nome: "",
    data_nascimento: "",
    responsavel: "",
    telefone: "",
    email: "",
    senha: ""
  });
  const handleChange = (e) => { 
  setAlunos({...alunos, [e.target.name]: e.target.value}); 
  }

  const handleClick = async e => {
  try {
    await axios.post("http://localhost:8000/alunos", alunos); 
    navigate("/")
  } catch (err) {
    console.log(err)
  }
  }

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
            <input type="text" onChange={handleChange} name="nome"/>
          </div>
          <div className="mb-2">
            <label className="label-rosa">Data de nascimento:</label>
            <input type="date" onChange={handleChange} name="data_nascimento"/>
          </div>
          <div className="mb-2">
            <label className="label-rosa">Nome do Responsável:</label>
            <input type="text" onChange={handleChange} name="responsavel"/>
          </div>
          <div className="mb-2">
            <label className="label-rosa">Telefone do Responsável:</label>
            <input type="text" onChange={handleChange} name="telefone"/>
          </div>
          <div className="mb-2">
            <label className="label-rosa">Email do Responsável:</label>
            <input type="email" onChange={handleChange} name="email"/>
          </div>
          <div className="mb-2">
            <label className="label-rosa">Senha:</label>
            <input type="password" onChange={handleChange} name="senha"/>         
          </div>
          <div className="mb-2">
            <label className="label-rosa">Confirmar senha:</label>
            <input type="password" />
          </div>
          <div className="button-container-rosa">
            <Link to = "/"> <button type="submit" className="custom-button-rosa" onClick={handleClick}> Registrar</button></Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
