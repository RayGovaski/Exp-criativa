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
  const [fileName, setFileName] = useState("Nenhum arquivo selecionado");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
        setFileName(files[0].name);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setError(null);
    
    // Validate passwords match
    if (apoiador.senha !== confirmarSenha) {
      setSenhaMatch(false);
      return;
    }
    
    // Form validation
    if (!apoiador.nome || !apoiador.cpf || !apoiador.email || !apoiador.senha || !apoiador.data_nascimento) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    // Create FormData object to send multipart form data (including file)
    const formData = new FormData();
    
    // Adicionar cada campo ao FormData
    Object.keys(apoiador).forEach(key => {
      // Se for o campo foto, adicione apenas se existir
      if (key === 'foto') {
        if (apoiador[key]) {
          formData.append(key, apoiador[key]);
        }
      } else {
        formData.append(key, apoiador[key]);
      }
    });
    
    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost:8000/apoiador", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // On successful registration, navigate to login
      alert("Cadastro realizado com sucesso! Faça o login para continuar.");
      navigate("/login");
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      } else if (err.request) {
        console.error("Request feito, mas sem resposta:", err.request);
      } else {
        console.error("Erro na configuração da requisição:", err.message);
      }
      setError("Ocorreu um erro ao processar seu cadastro. Tente novamente mais tarde.");
    }


  };
  
  const FileInput = ({ name, label, onChange }) => {
    return (
      <div className="mb-3">
        <label className="label-azul">{label}</label>
        <div className="file-input-wrapper2">
          <div className="file-input-container">
            <input 
              type="file" 
              ref={fileInputRef}
              name={name} 
              onChange={onChange}
              className="file-input-azul"
              accept="image/*"
            />
            <div className="file-input-button2">Escolher Arquivo</div>
          </div>
          <span className="file-name-display">{fileName}</span>
        </div>
        {previewImage && (
          <div className="preview-container mt-2">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="preview-image" 
            />
          </div>
        )}
      </div>
    );
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
        
        {error && (
          <div className="alert-error" style={{ 
            color: 'white', 
            backgroundColor: '#ff6b6b', 
            padding: '10px', 
            margin: '10px 15px 0', 
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <form className="registro-form-azul p-3" onSubmit={handleSubmit} encType="multipart/form-data">
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
          
          <FileInput 
            name="foto"
            label="Foto:"
            onChange={handleChange}
          />
          
          <div className="d-flex align-items-center mb-3 checkbox-wrapper">
            <div className="checkbox-container">
              <input 
                type="checkbox" 
                id="receberNotificacoes"
                name="receberNotificacoes"
                checked={apoiador.receberNotificacoes}
                onChange={handleChange}
                className="custom-checkbox"
              />
            </div>
            <div className="label-container">
              <label 
                htmlFor="receberNotificacoes" 
                className="notification-label"
              >
                quero receber notificação
              </label>
            </div>
          </div>
          
          <div className="button-container-azul">
            <button 
              type="submit" 
              className="custom-button-azul" 
              disabled={!senhaMatch || isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar'}
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