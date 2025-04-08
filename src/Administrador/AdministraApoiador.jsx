import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios' 


const Apoiador = () => {
    const [apoiador, setApoiador] = useState([]); 

    useEffect(() => {
        const fetchAllApoiador = async () => {
          try {
            const res = await axios.get("http://localhost:8000/apoiador"); 
            setApoiador(res.data); 
          } catch (err) {
            console.log(err)
          }
        };
        fetchAllApoiador();
      }, []);


  return (
    <div>
      <h1>
        apoiador lista
      </h1>
      <div className='apoiador'>
        {apoiador.map((apoiador) => ( 
          <div className='apoiador' key={apoiador.id}>
            <h3>{apoiador.nome}</h3>
            <p>{apoiador.email}</p>
            <p>{apoiador.telefone}</p>
            <p>{apoiador.data_nascimento}</p>
            <p>{apoiador.responsavel}</p>
          </div>
        ))}
      </div>
        
    </div>
  )
}

export default Apoiador