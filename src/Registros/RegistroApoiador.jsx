import React from "react";
import "./RegistroApoiador.css";
import { useState } from 'react'
import axios from 'axios' 
import { Link } from 'react-router-dom';


const RegistroApoiador = () => {
  const [apoiador, setApoiador] = useState({ 
      nome: "",
      cpf: "",
      email: "",
      senha: "",
      data_nascimento: "",
      telefone: "",
    });
    const handleChange = (e) => { 
    setApoiador({...apoiador, [e.target.name]: e.target.value}); 
    }
  
    const handleClick = async e => {
    try {
      await axios.post("http://localhost:8000/apoiador", apoiador); 
      navigate("/")
    } catch (err) {
      console.log(err)
    }
    }

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
            <input type="text" onChange={handleChange} name="nome"/>
          </div>
          <div className="mb-2">
            <label className="label-azul">CPF:</label>
            <input type="text" onChange={handleChange} name="cpf"/>
          </div>
          <div className="mb-2">
            <label className="label-azul">Email:</label>
            <input type="email" onChange={handleChange} name="email"/>
          </div>
          <div className="mb-2">
            <label className="label-azul">Senha:</label>
            <input type="password" onChange={handleChange} name="senha"/>
          </div>
          <div className="mb-2">
            <label className="label-azul">Confirmar senha:</label>
            <input type="password" />
          </div>
          <div className="mb-2">
            <label className="label-azul">Data de nascimento:</label>
            <input type="date" onChange={handleChange} name="data_nascimento"/>
          </div>
          <div className="mb-2">
            <label className="label-azul">Telefone:</label>
            <input type="text" onChange={handleChange} name="telefone"/>
          </div>
          <div className="button-container-azul">
           <button type="submit" class='custom-button-azul' onClick={handleClick}>
              <Link to = "/"> Registrar </Link>
            </button> 
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default RegistroApoiador;
