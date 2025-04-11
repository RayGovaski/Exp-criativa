import React from 'react'
import { useState } from 'react'
import axios from 'axios' 
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Update = () => {

  const [alunos, setAlunos] = useState({ 
      nome: "",
      data_nascimento: "",
      responsavel: "",
      telefone: "",
      email: "",
      senha: ""
    });

  const navigate = useNavigate(); 

  const location = useLocation(); 

  const id = location.pathname.split("/")[2];

  const handleChange = (e) => { 
    setAlunos({...alunos, [e.target.name]: e.target.value}); 
  }

  const handleClick = async e => {
    e.preventDefault(); // evita o reload da página ao clicar no botão
    try {
      await axios.put("http://localhost:8000/alunos/" + id, alunos); 
      navigate("/adm-aluno");
    } catch (err) {
      console.log(err);
    }
  }
  

  return (
    <div className='add'>
      <h1>Editar um aluno</h1>

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
                  <button className="custom-button-rosa" onClick={handleClick}> Editar</button>
                </div>

              </form>

    </div>
  )
}

export default Update