import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios' 
import "./AdministraAlunos.css";


const Alunos = () => {
    const [alunos, setAlunos] = useState([]); 

    useEffect(() => {
        const fetchAllAlunos = async () => {
          try {
            const res = await axios.get("http://localhost:8000/alunos"); 
            setAlunos(res.data); 
          } catch (err) {
            console.log(err)
          }
        };
        fetchAllAlunos();
      }, []);

      const handleDelete = async (id) => { 
        try {
          await axios.delete(`http://localhost:8000/alunos/${id}`); 
          window.location.reload();
        } catch (err) {
          console.log(err)
        }
      };


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

            <button className='delete' onClick={() => handleDelete(aluno.id)}>Deletar</button>
          </div>
        ))}
      </div>
        
    </div>
  )
}

export default Alunos