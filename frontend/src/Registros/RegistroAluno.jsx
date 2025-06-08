import React, { useState, useRef } from "react";
import "./RegistroAluno.css";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Add = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [fileNames, setFileNames] = useState({
    responsavel_comprovante_residencia: "Nenhum arquivo selecionado",
    responsavel_comprovante_renda: "Nenhum arquivo selecionado",
    aluno_foto: "Nenhum arquivo selecionado"
  });
  
  const [formData, setFormData] = useState({
    // Responsável (passo 1)
    responsavel_cpf: "",
    responsavel_nome: "",
    responsavel_sexo: "",
    responsavel_data_nascimento: "",
    responsavel_telefone: "",
    responsavel_email: "",
    responsavel_logradouro: "",
    responsavel_numero_residencia: "",
    responsavel_cep: "",
    responsavel_comprovante_residencia: null,
    responsavel_grau_parentesco: "",
    responsavel_profissao: "",
    responsavel_renda_familiar: "",
    responsavel_comprovante_renda: null,
    
    // Aluno (passo 2)
    aluno_cpf: "",
    aluno_rg: "",
    aluno_nome: "",
    aluno_sexo: "",
    aluno_data_nascimento: "",
    aluno_nacionalidade: "",
    aluno_telefone: "",
    aluno_necessidades_especiais: "",
    aluno_email: "",
    aluno_senha: "",
    aluno_confirmar_senha: "",
    aluno_foto: null
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({...formData, [name]: files[0]});
      setFileNames({...fileNames, [name]: files[0].name});
    }
  };
  
  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };
  
  const handlePrevious = (e) => {
    e.preventDefault();
    setStep(1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.aluno_senha !== formData.aluno_confirmar_senha) {
      alert("As senhas não coincidem!");
      return;
    }
    
    const submitData = new FormData();
    
    for (const key in formData) {
      if (formData[key] !== null) {
        submitData.append(key, formData[key]);
      }
    }
    
    try {
      await axios.post("http://localhost:8000/alunos", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Erro ao cadastrar. Verifique os dados e tente novamente.");
    }
  };
  
  const FileInput = ({ name, label, value, onChange }) => {
    return (
      <div className="mb-2">
        <label className="label-rosa">{label}</label>
        <div className="file-input-wrapper">
          <div className="file-input-container">
            <input 
              type="file" 
              name={name} 
              onChange={onChange}
              className="file-input-rosa"
            />
            <div className="file-input-button">Escolher Arquivo</div>
          </div>
          <span className="file-name-display">{fileNames[name]}</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="d-flex justify-content-center align-items-center fundo-rosa" style={{ minHeight: "100vh" }}>
      <div className="registro-container-rosa">
        <div className="registro-header-rosa"></div>
        <div className="title-container">
          <h3 className="text-center-rosa">
            {step === 1 ? "Cadastro do Responsável" : "Cadastro do Aluno"}
          </h3>
          <div className="footer-line2-rosa"></div>
          <div className="steps-indicator">
            <span className={`step ${step === 1 ? "active" : ""}`}>1</span>
            <span className="step-line"></span>
            <span className={`step ${step === 2 ? "active" : ""}`}>2</span>
          </div>
        </div>
        
        <form className="registro-form-rosa p-3">
          {step === 1 ? (
            // passo 1: Responsável
            <>
              <div className="mb-2">
                <label className="label-rosa">CPF:</label>
                <input 
                  type="text" 
                  name="responsavel_cpf" 
                  value={formData.responsavel_cpf} 
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Nome completo:</label>
                <input 
                  type="text" 
                  name="responsavel_nome" 
                  value={formData.responsavel_nome} 
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Sexo:</label>
                <select 
                  name="responsavel_sexo" 
                  value={formData.responsavel_sexo} 
                  onChange={handleChange}
                  className="select-rosa"
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="label-rosa">Data de nascimento:</label>
                <input 
                  type="date" 
                  name="responsavel_data_nascimento" 
                  value={formData.responsavel_data_nascimento} 
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Telefone:</label>
                <input 
                  type="text" 
                  name="responsavel_telefone" 
                  value={formData.responsavel_telefone} 
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Email:</label>
                <input 
                  type="email" 
                  name="responsavel_email" 
                  value={formData.responsavel_email} 
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Logradouro:</label>
                <input 
                  type="text" 
                  name="responsavel_logradouro" 
                  value={formData.responsavel_logradouro} 
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Número da residência:</label>
                <input 
                  type="text" 
                  name="responsavel_numero_residencia" 
                  value={formData.responsavel_numero_residencia} 
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">CEP:</label>
                <input 
                  type="text" 
                  name="responsavel_cep" 
                  value={formData.responsavel_cep} 
                  onChange={handleChange}
                  placeholder="00000-000"
                />
              </div>
              
              <FileInput 
                name="responsavel_comprovante_residencia"
                label="Comprovante de residência:"
                value={formData.responsavel_comprovante_residencia}
                onChange={handleFileChange}
              />
              
              <div className="mb-2">
                <label className="label-rosa">Grau de parentesco:</label>
                <input 
                  type="text" 
                  name="responsavel_grau_parentesco" 
                  value={formData.responsavel_grau_parentesco} 
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Profissão:</label>
                <input 
                  type="text" 
                  name="responsavel_profissao" 
                  value={formData.responsavel_profissao} 
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Renda familiar:</label>
                <input 
                  type="text" 
                  name="responsavel_renda_familiar" 
                  value={formData.responsavel_renda_familiar} 
                  onChange={handleChange}
                  placeholder="R$ 0,00"
                />
              </div>
              
              <FileInput 
                name="responsavel_comprovante_renda"
                label="Comprovante de renda:"
                value={formData.responsavel_comprovante_renda}
                onChange={handleFileChange}
              />
              
              <div className="button-container-rosa">
                <button type="button" className="custom-button-rosa" onClick={handleNext}>
                  Próximo
                </button>
              </div>
            </>
          ) : (
            // passo 2: Aluno
            <>
              <div className="mb-2">
                <label className="label-rosa">CPF:</label>
                <input 
                  type="text" 
                  name="aluno_cpf" 
                  value={formData.aluno_cpf} 
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">RG:</label>
                <input 
                  type="text" 
                  name="aluno_rg" 
                  value={formData.aluno_rg} 
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Nome completo:</label>
                <input 
                  type="text" 
                  name="aluno_nome" 
                  value={formData.aluno_nome} 
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Sexo:</label>
                <select 
                  name="aluno_sexo" 
                  value={formData.aluno_sexo} 
                  onChange={handleChange}
                  className="select-rosa"
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="label-rosa">Data de nascimento:</label>
                <input 
                  type="date" 
                  name="aluno_data_nascimento" 
                  value={formData.aluno_data_nascimento} 
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Nacionalidade:</label>
                <input 
                  type="text" 
                  name="aluno_nacionalidade" 
                  value={formData.aluno_nacionalidade} 
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Telefone:</label>
                <input 
                  type="text" 
                  name="aluno_telefone" 
                  value={formData.aluno_telefone} 
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Necessidades especiais:</label>
                <textarea 
                  name="aluno_necessidades_especiais" 
                  value={formData.aluno_necessidades_especiais} 
                  onChange={handleChange}
                  className="textarea-rosa"
                  placeholder="Descreva se houver necessidades especiais"
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Email:</label>
                <input 
                  type="email" 
                  name="aluno_email" 
                  value={formData.aluno_email} 
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Senha:</label>
                <input 
                  type="password" 
                  name="aluno_senha" 
                  value={formData.aluno_senha} 
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="label-rosa">Confirmar senha:</label>
                <input 
                  type="password" 
                  name="aluno_confirmar_senha" 
                  value={formData.aluno_confirmar_senha} 
                  onChange={handleChange}
                />
              </div>
              
              <FileInput 
                name="aluno_foto"
                label="Foto do aluno:"
                value={formData.aluno_foto}
                onChange={handleFileChange}
              />
              
              <div className="button-container-rosa">
                <button type="button" className="secondary-button-rosa" onClick={handlePrevious}>
                  Voltar
                </button>
                <button type="submit" className="custom-button-rosa" onClick={handleSubmit}>
                  Registrar
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Add;

