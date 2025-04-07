import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios' 
import { Link } from 'react-router-dom';
import "./AdministraAlunos.css";


const Alunos = () => {
    const [alunos, setAlunos] = useState([]); // useState para armazenar os alunos

    useEffect(() => {
        const fetchAllAlunos = async () => {
          try {
            const res = await axios.get("http://localhost:8000/alunos"); // get para o backend
            setAlunos(res.data); 
          } catch (err) {
            console.log(err)
          }
        };
        fetchAllAlunos();
      }, []);


  return (
    <div>
      <h1>
        alunos lista
      </h1>
      <div className='alunos'>
        {alunos.map((aluno) => ( // map para percorrer os alunos
          <div className='aluno' key={aluno.id}>
            <h3>{aluno.nome}</h3>
            <p>{aluno.email}</p>
            <p>{aluno.telefone}</p>
            <p>{aluno.data_nascimento}</p>
            <p>{aluno.responsavel}</p>
          </div>
        ))}
      </div>
        
    </div>
  )
}

export default Alunos