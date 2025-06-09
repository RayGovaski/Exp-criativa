import React, { useState, useRef } from "react";
import "./RegistroApoiador.css";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importa a função toast

const RegistroApoiador = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [senhaMatch, setSenhaMatch] = useState(true);
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [fileName, setFileName] = useState("Nenhum arquivo selecionado");
  const [isLoading, setIsLoading] = useState(false);
  // Removido o estado 'error' local que era exibido como div, agora usaremos toast.error
  // const [error, setError] = useState(null);

  const [apoiador, setApoiador] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    data_nascimento: "",
    telefone: "",
    foto: null,
    receberNotificacoes: false
    // Se 'plano_nome' foi adicionado anteriormente, adicione-o aqui novamente se necessário
    // plano_nome: ""
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
      } else { // Se o arquivo for desmarcado ou não selecionado
        setApoiador({...apoiador, [name]: null});
        setFileName("Nenhum arquivo selecionado");
        setPreviewImage(null);
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

    // Reset error state (já não é necessário com toast)
    // setError(null);

    // Validação de senhas
    if (apoiador.senha !== confirmarSenha) {
      setSenhaMatch(false);
      toast.error("As senhas não coincidem!"); // Substituído setError
      return;
    }
    // Validação de senha mínima (adicionado novamente, se foi perdido)
    if (apoiador.senha.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    // Validação de campos obrigatórios
    if (!apoiador.nome || !apoiador.cpf || !apoiador.email || !apoiador.senha || !apoiador.data_nascimento || !apoiador.telefone) {
      toast.error("Por favor, preencha todos os campos obrigatórios."); // Substituído setError
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
      } else if (apoiador[key] !== null) { // Não envie nulls se não for 'foto'
        formData.append(key, apoiador[key]);
      }
    });

    setIsLoading(true);
    toast.info("Registro em andamento..."); // Notificação de informação

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post("http://localhost:8000/apoiador", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Cadastro realizado com sucesso! Faça o login para continuar."); // Substituído alert()
      navigate("/login");
    } catch (err) {
      console.error("Erro ao cadastrar:", err);

      let errorMessage = "Ocorreu um erro ao processar seu cadastro. Tente novamente mais tarde.";
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = err.response.data.error; // Erro específico do backend
      } else if (err.message) {
        errorMessage = `Erro de rede: ${err.message}`; // Erro de rede
      }
      toast.error(errorMessage); // Exibir erro com toast
    } finally {
      setIsLoading(false);
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

        {/* Removido o bloco de erro customizado, pois agora usaremos toast */}
        {/* {error && (
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
        )} */}

        <form className="registro-form-azul p-3" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-2">
            <label className="label-azul">Nome completo:</label>
            <input
              type="text"
              onChange={handleChange}
              name="nome"
              value={apoiador.nome}
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
            />
          </div>

          <div className="mb-2">
            <label className="label-azul">Data de nascimento:</label>
            <input
              type="date"
              onChange={handleChange}
              name="data_nascimento"
              value={apoiador.data_nascimento}
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
            />
          </div>

          <div className="mb-2">
            <label className="label-azul">Email:</label>
            <input
              type="email"
              onChange={handleChange}
              name="email"
              value={apoiador.email}
            />
          </div>

          <div className="mb-2">
            <label className="label-azul">Senha:</label>
            <input
              type="password"
              onChange={handleChange}
              name="senha"
              value={apoiador.senha}
            />
          </div>

          <div className="mb-3">
            <label className="label-azul">Confirmar senha:</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={handleConfirmarSenhaChange}
              className={!senhaMatch ? 'is-invalid' : ''}
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