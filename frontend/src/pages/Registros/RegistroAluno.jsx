// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from "react";
import "./RegistroAluno.css";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importa a função toast

const RegistroAluno = () => { // Renomeado de Add para RegistroAluno
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [fileNames, setFileNames] = useState({
    responsavel_comprovante_residencia: "Nenhum arquivo selecionado",
    responsavel_comprovante_renda: "Nenhum arquivo selecionado",
    aluno_foto: "Nenhum arquivo selecionado"
  });

  const [formData, setFormData] = useState({
    // Responsável (passo 1)
    responsavel_nome: "",
    responsavel_cpf: "",
    responsavel_data_nascimento: "",
    responsavel_sexo: "",
    responsavel_telefone: "", // Telefone do responsável vem antes do email
    responsavel_email: "",
    responsavel_profissao: "",
    responsavel_renda_familiar: "",
    responsavel_comprovante_renda: null,
    responsavel_cep: "",
    responsavel_logradouro: "",
    responsavel_numero_residencia: "",
    responsavel_comprovante_residencia: null,
    responsavel_grau_parentesco: "",

    // Aluno (passo 2)
    aluno_nome: "",
    aluno_cpf: "",
    aluno_sexo: "",
    aluno_data_nascimento: "",
    aluno_nacionalidade: "",
    aluno_email: "", // Email do aluno vem antes da senha
    aluno_senha: "",
    aluno_confirmar_senha: "",
    aluno_necessidades_especiais: "",
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
    // Validações para o Passo 1 (Responsável)
    if (!formData.responsavel_nome || !formData.responsavel_cpf || !formData.responsavel_data_nascimento ||
        !formData.responsavel_sexo || !formData.responsavel_telefone || !formData.responsavel_email ||
        !formData.responsavel_cep || !formData.responsavel_logradouro || !formData.responsavel_numero_residencia) {
        toast.error("Por favor, preencha todos os campos obrigatórios do Responsável.");
        return;
    }
    // Validação de email para o responsável
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.responsavel_email)) {
        toast.error("Por favor, insira um e-mail válido para o Responsável.");
        return;
    }

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
    // Validação de senhas do Aluno
    if (formData.aluno_senha !== formData.aluno_confirmar_senha) {
      toast.error("As senhas do Aluno não coincidem!");
      return;
    }
    if (formData.aluno_senha.length < 6) { // Exemplo de validação de tamanho da senha
        toast.error("A senha do Aluno deve ter pelo menos 6 caracteres.");
        return;
    }

    // Validações para o Passo 2 (Aluno)
    if (!formData.aluno_nome || !formData.aluno_cpf || !formData.aluno_sexo ||
        !formData.aluno_data_nascimento || !formData.aluno_email || !formData.aluno_senha ||
        !formData.aluno_confirmar_senha) {
        toast.error("Por favor, preencha todos os campos obrigatórios do Aluno.");
        return;
    }
    // Validação de email para o aluno
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.aluno_email)) {
        toast.error("Por favor, insira um e-mail válido para o Aluno.");
        return;
    }


    const submitData = new FormData();

    for (const key in formData) {
      // Anexar apenas se o valor não for null, e se for um arquivo, anexar o próprio objeto File
      if (formData[key] !== null && formData[key] !== undefined) {
        submitData.append(key, formData[key]);
      }
    }

    // Para depuração: ver o conteúdo do FormData
    // for (let pair of submitData.entries()) {
    //   console.log(pair[0]+ ': ' + pair[1]);
    // }

    try {
      // Ajuste o endpoint se necessário
      await axios.post("http://localhost:8000/alunos", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("Cadastro realizado com sucesso!");
      navigate("/login"); // Redireciona para a página de login após o cadastro
    } catch (err) {
      console.log("Erro completo ao cadastrar aluno:", err); // Log mais detalhado
      let errorMessage = "Erro ao cadastrar. Verifique os dados e tente novamente.";
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = err.response.data.error; // Erro vindo do backend
      } else if (err.message) {
          errorMessage = err.message; // Erro de rede ou Axios
      }
      toast.error(errorMessage);
    }
  };

  // Componente FileInput
  const FileInput = ({ name, label, onChange, required = false }) => {
    return (
      <div className="mb-2">
        <label className="label-rosa">{label}{required && <span className="text-danger">*</span>}</label>
        <div className="file-input-wrapper">
          <div className="file-input-container">
            <input
              type="file"
              name={name}
              onChange={onChange}
              className="file-input-rosa"
              required={required}
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
            // Passo 1: Responsável
            <>
              {/* responsavel_nome */}
              <div className="mb-2">
                <label className="label-rosa">Nome completo: *</label>
                <input
                  type="text"
                  name="responsavel_nome"
                  value={formData.responsavel_nome}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* responsavel_cpf */}
              <div className="mb-2">
                <label className="label-rosa">CPF: *</label>
                <input
                  type="text"
                  name="responsavel_cpf"
                  value={formData.responsavel_cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              {/* responsavel_data_nascimento */}
              <div className="mb-2">
                <label className="label-rosa">Data de nascimento: *</label>
                <input
                  type="date"
                  name="responsavel_data_nascimento"
                  value={formData.responsavel_data_nascimento}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* responsavel_sexo */}
              <div className="mb-2">
                <label className="label-rosa">Sexo: *</label>
                <select
                  name="responsavel_sexo"
                  value={formData.responsavel_sexo}
                  onChange={handleChange}
                  className="select-rosa"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              {/* responsavel_telefone */}
              <div className="mb-2">
                <label className="label-rosa">Telefone: *</label>
                <input
                  type="text"
                  name="responsavel_telefone"
                  value={formData.responsavel_telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
              {/* responsavel_email */}
              <div className="mb-2">
                <label className="label-rosa">Email: *</label>
                <input
                  type="email"
                  name="responsavel_email"
                  value={formData.responsavel_email}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* responsavel_profissao */}
              <div className="mb-2">
                <label className="label-rosa">Profissão:</label>
                <input
                  type="text"
                  name="responsavel_profissao"
                  value={formData.responsavel_profissao}
                  onChange={handleChange}
                />
              </div>
              {/* responsavel_renda_familiar */}
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
              {/* responsavel_comprovante_renda */}
              <FileInput
                name="responsavel_comprovante_renda"
                label="Comprovante de renda:"
                onChange={handleFileChange}
              />
              {/* responsavel_cep */}
              <div className="mb-2">
                <label className="label-rosa">CEP: *</label>
                <input
                  type="text"
                  name="responsavel_cep"
                  value={formData.responsavel_cep}
                  onChange={handleChange}
                  placeholder="00000-000"
                  required
                />
              </div>
              {/* responsavel_logradouro */}
              <div className="mb-2">
                <label className="label-rosa">Logradouro: *</label>
                <input
                  type="text"
                  name="responsavel_logradouro"
                  value={formData.responsavel_logradouro}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* responsavel_numero_residencia */}
              <div className="mb-2">
                <label className="label-rosa">Número da residência: *</label>
                <input
                  type="text"
                  name="responsavel_numero_residencia"
                  value={formData.responsavel_numero_residencia}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* responsavel_comprovante_residencia */}
              <FileInput
                name="responsavel_comprovante_residencia"
                label="Comprovante de residência:"
                onChange={handleFileChange}
              />
              {/* responsavel_grau_parentesco */}
              <div className="mb-2">
                <label className="label-rosa">Grau de parentesco:</label>
                <select
                  name="responsavel_grau_parentesco"
                  value={formData.responsavel_grau_parentesco}
                  onChange={handleChange}
                  className="select-rosa"
                >
                  <option value="">Selecione</option> {/* Adicionado "Selecione" */}
                  <option value="Mãe/Pai">Mãe/Pai</option>
                  <option value="Avó/Avô">Avó/Avô</option>
                  <option value="Outros">Outro grau de parentesco</option>
                </select>
              </div>

              <div className="button-container-rosa">
                <button type="button" className="custom-button-rosa" onClick={handleNext}>
                  Próximo
                </button>
              </div>
            </>
          ) : (
            // Passo 2: Aluno
            <>
              {/* aluno_nome */}
              <div className="mb-2">
                <label className="label-rosa">Nome completo: *</label>
                <input
                  type="text"
                  name="aluno_nome"
                  value={formData.aluno_nome}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* aluno_cpf */}
              <div className="mb-2">
                <label className="label-rosa">CPF: *</label>
                <input
                  type="text"
                  name="aluno_cpf"
                  value={formData.aluno_cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              {/* aluno_sexo */}
              <div className="mb-2">
                <label className="label-rosa">Sexo: *</label>
                <select
                  name="aluno_sexo"
                  value={formData.aluno_sexo}
                  onChange={handleChange}
                  className="select-rosa"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              {/* aluno_data_nascimento */}
              <div className="mb-2">
                <label className="label-rosa">Data de nascimento: *</label>
                <input
                  type="date"
                  name="aluno_data_nascimento"
                  value={formData.aluno_data_nascimento}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* aluno_nacionalidade */}
              <div className="mb-2">
                <label className="label-rosa">Nacionalidade:</label>
                <input
                  type="text"
                  name="aluno_nacionalidade"
                  value={formData.aluno_nacionalidade}
                  onChange={handleChange}
                />
              </div>
              {/* aluno_email */}
              <div className="mb-2">
                <label className="label-rosa">Email: *</label>
                <input
                  type="email"
                  name="aluno_email"
                  value={formData.aluno_email}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* aluno_senha */}
              <div className="mb-2">
                <label className="label-rosa">Senha: *</label>
                <input
                  type="password"
                  name="aluno_senha"
                  value={formData.aluno_senha}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* aluno_confirmar_senha */}
              <div className="mb-2">
                <label className="label-rosa">Confirmar senha: *</label>
                <input
                  type="password"
                  name="aluno_confirmar_senha"
                  value={formData.aluno_confirmar_senha}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* aluno_necessidades_especiais */}
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
              {/* aluno_foto */}
              <FileInput
                name="aluno_foto"
                label="Foto do aluno:"
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

export default RegistroAluno;