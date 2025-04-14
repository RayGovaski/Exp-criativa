import React, { useState, useRef } from "react";
import "./RegistroApoiador.css";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegistroApoiador = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [senhaMatch, setSenhaMatch] = useState(true);
  const [confirmarSenha, setConfirmarSenha] = useState("");
  
  const [apoiador, setApoiador] = useState({ 
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    data_nascimento: "",
    telefone: "",
    foto: null,
    receberNotificacoes: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setApoiador({...apoiador, [name]: checked});
    } else if (type === 'file') {
      if (files.length > 0) {
        setApoiador({...apoiador, [name]: files[0]});
        // Preview da imagem
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setApoiador({...apoiador, [name]: value});
    }
  };
  
  const handleConfirmarSenhaChange = (e) => {
    setConfirmarSenha(e.target.value);
    setSenhaMatch(apoiador.senha === e.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    
    // Verificar se senhas coincidem
    if (apoiador.senha !== confirmarSenha) {
      setSenhaMatch(false);
      return;
    }
    
    // Criar FormData para enviar a foto
    const formData = new FormData();
    for (const key in apoiador) {
      formData.append(key, apoiador[key]);
    }
    
    try {
      await axios.post("http://localhost:8000/apoiador", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  
  const handleFotoClick = () => {
    fileInputRef.current.click();
  };

  // Estilo customizado para o checkbox pequeno
  const checkboxStyle = {
    width: '16px',
    height: '16px',
    marginRight: '8px',
    cursor: 'pointer'
  };

  return (
    <div className="d-flex justify-content-center align-items-center fundo-azul" style={{ minHeight: "100vh" }}>
      <div className="registro-container-azul">
        <div className="registro-header-azul">
        </div>
        <div className="title-container-azul">
          <h3 className="text-center-azul">Registro de Apoiador</h3>
          <div className="footer-line2-azul"></div>
        </div>
        <form className="registro-form-azul p-3">
          <div className="mb-2">
            <label className="label-azul">Nome completo:</label>
            <input 
              type="text" 
              onChange={handleChange} 
              name="nome" 
              value={apoiador.nome}
              required
            />
          </div>
          
          <div className="mb-2">
            <label className="label-azul">CPF:</label>
            <input 
              type="text" 
              onChange={handleChange} 
              name="cpf" 
              value={apoiador.cpf}
              placeholder="000.000.000-00"
              required
            />
          </div>
          
          <div className="mb-2">
            <label className="label-azul">Data de nascimento:</label>
            <input 
              type="date" 
              onChange={handleChange} 
              name="data_nascimento" 
              value={apoiador.data_nascimento}
              required
            />
          </div>
          
          <div className="mb-2">
            <label className="label-azul">Telefone:</label>
            <input 
              type="text" 
              onChange={handleChange} 
              name="telefone" 
              value={apoiador.telefone}
              placeholder="(00) 00000-0000"
              required
            />
          </div>
          
          <div className="mb-2">
            <label className="label-azul">Email:</label>
            <input 
              type="email" 
              onChange={handleChange} 
              name="email" 
              value={apoiador.email}
              required
            />
          </div>
          
          <div className="mb-2">
            <label className="label-azul">Senha:</label>
            <input 
              type="password" 
              onChange={handleChange} 
              name="senha" 
              value={apoiador.senha}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="label-azul">Confirmar senha:</label>
            <input 
              type="password"
              value={confirmarSenha}
              onChange={handleConfirmarSenhaChange}
              className={!senhaMatch ? 'is-invalid' : ''}
              required
            />
            {!senhaMatch && (
              <div className="text-danger" style={{fontSize: '14px', marginLeft: '15px'}}>
                As senhas não coincidem
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <label className="label-azul d-block">Foto:</label>
            <div className="d-flex align-items-center mb-2">
              {previewImage && (
                <div className="me-3">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }} 
                  />
                </div>
              )}
              <div className="button-container-azul" style={{margin: 0}}>
                <button 
                  type="button"
                  className="custom-button-azul"
                  onClick={handleFotoClick}
                  style={{fontSize: '16px'}}
                >
                  Selecionar foto
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleChange} 
                name="foto" 
                className="d-none"
                accept="image/*"
              />
            </div>
          </div>
          
          <div className="mb-3 d-flex align-items-center" style={{marginLeft: '15px'}}>
            <input 
              type="checkbox" 
              id="receberNotificacoes"
              name="receberNotificacoes"
              checked={apoiador.receberNotificacoes}
              onChange={handleChange}
              style={checkboxStyle}
            />
            <label htmlFor="receberNotificacoes" style={{color: '#0A7D7E', cursor: 'pointer'}}>
              Desejo receber notificações por email
            </label>
          </div>
          
          <div className="button-container-azul">
            <button 
              type="submit" 
              className="custom-button-azul" 
              onClick={handleClick}
              disabled={!senhaMatch}
            >
              Registrar
            </button> 
          </div>
          
          <div className="mt-3 text-center">
            <p>Já tem uma conta? <Link to="/login" className="text-decoration-none" style={{color: '#0A7D7E'}}>Entrar</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroApoiador;