/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'; // Re-adicionado useState, useEffect
import { Card, Image, Button, Modal, Form, Alert } from 'react-bootstrap'; // Re-adicionado Modal, Form, Alert
// import { useAuth } from '../../../context/AuthContext'; // Mantido se precisar do logout simulado
// import axios from 'axios'; // Removido, pois não haverá requisições HTTP reais
import './DadosPessoaisAluno.css';

const DadosPessoaisAluno = () => {
  // --- Dados do Aluno Mockados (Simulados) ---
  const initialAlunoData = {
    nome: "Maria Eduarda Silva",
    data_nascimento: "2015-08-20", // Formato YYYY-MM-DD
    cpf: "123.456.789-00",
    telefone: "(11) 98765-4321",
    email: "maria.eduarda@email.com",
    // Simulação de foto de perfil (apenas um placeholder)
    foto_url: 'https://via.placeholder.com/150?text=Aluno',
    responsavel: {
      nome: "Ana Paula Silva",
      cpf: "000.111.222-33",
      telefone: "(11) 91234-5678",
      email: "ana.paula@email.com"
    }
  };

  const [alunoData, setAlunoData] = useState(initialAlunoData); // Agora useState com dados mockados
  const [loading, setLoading] = useState(false); // Sempre false, pois dados são mockados
  const [error, setError] = useState(null); // Sempre null
  const [imagem, setImagem] = useState(null); // Para pré-visualização da imagem local
  const [imagemFile, setImagemFile] = useState(null); // Para armazenar o arquivo da imagem
  const [uploading, setUploading] = useState(false); // Para simular estado de upload
  const [showModal, setShowModal] = useState(false); // Para controlar o modal
  const [campoParaAtualizar, setCampoParaAtualizar] = useState(""); // Qual campo será atualizado no modal
  const [formDados, setFormDados] = useState({ // Dados do formulário do modal
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
    novoEmail: "",
    novoTelefone: ""
  });
  const [updateSuccess, setUpdateSuccess] = useState(""); // Mensagem de sucesso
  const [updateError, setUpdateError] = useState(""); // Mensagem de erro

  // Não há useEffect para buscar dados, pois eles já são mockados

  // Function to handle image change
  const handleImagemChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagemFile(file);

      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagem(event.target.result); // Define a pré-visualização da imagem local
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to get the profile image source
  const getProfileImageSrc = () => {
    // Se há uma imagem temporária sendo enviada, mostra essa primeiro
    if (imagem) {
      return imagem;
    }
    // Caso contrário, usa a URL mockada do alunoData
    return alunoData.foto_url;
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDados(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAbrirModal = () => {
    setShowModal(true);
    setCampoParaAtualizar("");
    setFormDados({
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
      novoEmail: "",
      novoTelefone: ""
    });
    setUpdateSuccess("");
    setUpdateError("");
  };

  const handleFecharModal = () => {
    setShowModal(false);
  };


  const handleSalvarFoto = async () => {
    if (!imagemFile) {
      alert('Por favor, selecione uma foto primeiro.');
      return;
    }

    setUploading(true);
    // Simulação de upload: espera um pouco e depois "atualiza"
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay de rede

    setImagem(null); // Limpa a pré-visualização
    setImagemFile(null); // Limpa o arquivo
    // AlunoData não é atualizado pois não há backend
    alert('Foto atualizada com sucesso (simulado)!');
    setUploading(false);
  };

  const handleSubmitAtualizacao = async () => {
    setUpdateSuccess("");
    setUpdateError("");

    // Simulação de delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      let successMessage = "";
      switch (campoParaAtualizar) {
        case "senha":
          if (formDados.novaSenha !== formDados.confirmarSenha) {
            setUpdateError("As senhas não coincidem.");
            return;
          }
          if (formDados.novaSenha.length < 6) {
            setUpdateError("A senha deve ter pelo menos 6 caracteres.");
            return;
          }
          // Lógica de atualização de senha simulada
          successMessage = "Senha atualizada com sucesso (simulado)!";
          break;
        case "email":
          { if (!formDados.novoEmail) {
            setUpdateError("Email não pode estar vazio.");
            return;
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formDados.novoEmail)) {
            setUpdateError("Email inválido.");
            return;
          }
          // Lógica de atualização de email simulada
          setAlunoData(prevData => ({ ...prevData, email: formDados.novoEmail }));
          successMessage = "Email atualizado com sucesso (simulado)!";
          break; }
        case "telefone":
          if (!formDados.novoTelefone) {
            setUpdateError("Telefone não pode estar vazio.");
            return;
          }
          // Lógica de atualização de telefone simulada
          setAlunoData(prevData => ({ ...prevData, telefone: formDados.novoTelefone }));
          successMessage = "Telefone atualizado com sucesso (simulado)!";
          break;
        default:
          setUpdateError("Selecione o que deseja atualizar.");
          return;
      }

      setUpdateSuccess(successMessage);

      // Reset form fields after successful update
      setFormDados({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
        novoEmail: "",
        novoTelefone: ""
      });

      // Close modal after a short delay to show success message
      setTimeout(() => {
        setShowModal(false);
      }, 1500);

    } catch (error) { // Este catch só pegaria erros de validação local
      setUpdateError("Erro simulado ao atualizar dados.");
    }
  };

  const handleLogout = () => {
    alert("Logout simulado!");
    // Se você tiver um AuthContext local, pode chamar uma função de logout simulada aqui
    // Ex: logout();
  };

  const renderFormularioAtualizacao = () => {
    switch (campoParaAtualizar) {
      case "senha":
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label className="label-azul">Senha atual</Form.Label>
              <Form.Control
                type="password"
                name="senhaAtual"
                value={formDados.senhaAtual}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="label-azul">Nova senha</Form.Label>
              <Form.Control
                type="password"
                name="novaSenha"
                value={formDados.novaSenha}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="label-azul">Confirmar nova senha</Form.Label>
              <Form.Control
                type="password"
                name="confirmarSenha"
                value={formDados.confirmarSenha}
                onChange={handleInputChange}
              />
            </Form.Group>
          </>
        );
      case "email":
        return (
          <Form.Group className="mb-3">
            <Form.Label className="label-azul">Novo email</Form.Label>
            <Form.Control
              type="email"
              name="novoEmail"
              value={formDados.novoEmail}
              onChange={handleInputChange}
              placeholder="exemplo@email.com"
            />
          </Form.Group>
        );
      case "telefone":
        return (
          <Form.Group className="mb-3">
            <Form.Label className="label-azul">Novo telefone</Form.Label>
            <Form.Control
              type="text"
              name="novoTelefone"
              value={formDados.novoTelefone}
              onChange={handleInputChange}
              placeholder="(XX) XXXXX-XXXX"
            />
          </Form.Group>
        );

      default:
        return (
          <p className="text-muted text-center">Selecione qual informação deseja atualizar</p>
        );
    }
  };

  // A tela de loading e erro são desnecessárias se os dados são mockados e não há requisições
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
      <Card className="mb-4 shadow-sm p-4">
        <h4 className="label-azul mb-4">Dados Pessoais do Aluno</h4>

        <div className="row mb-4">
          <div className="col-md-4 text-center">
            <div className="d-flex flex-column align-items-center">
              <div className="profile-image-container-aluno mb-3">
                <Image
                  src={getProfileImageSrc()}
                  roundedCircle
                  className="profile-image-aluno"
                  alt="Foto de perfil do aluno"
                  // Removido onError, pois o src agora sempre será válido (mockado)
                />
              </div>
              <div className="custom-file-input mb-3">
                <input
                  type="file"
                  id="file-input-aluno"
                  className="d-none"
                  onChange={handleImagemChange}
                  accept="image/*"
                />
                <label htmlFor="file-input-aluno" className="btn btn-outline-secondary">
                  Escolher Foto
                </label>
              </div>
              <Button
                className="custom-button-azul5"
                onClick={handleSalvarFoto}
                disabled={!imagemFile || uploading}
              >
                {uploading ? 'Enviando...' : 'Salvar Foto'}
              </Button>
            </div>
          </div>

          <div className="col-md-8">
            <div className="mb-3">
              <h6 className="label-azul">Nome completo do Aluno</h6>
              <p className="form-control border bg-light">{alunoData.nome}</p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">Data de nascimento</h6>
              <p className="form-control border bg-light">
                {alunoData.data_nascimento
                  ? new Date(alunoData.data_nascimento).toLocaleDateString('pt-BR')
                  : 'Não informado'}
              </p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">CPF do Aluno</h6>
              <p className="form-control border bg-light">{alunoData.cpf || 'Não informado'}</p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">Telefone do Aluno</h6>
              <p className="form-control border bg-light">{alunoData.telefone || 'Não informado'}</p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">Email do Aluno</h6>
              <p className="form-control border bg-light">{alunoData.email || 'Não informado'}</p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">Senha</h6>
              <p className="form-control border bg-light">••••••••</p>
            </div>
          </div>
        </div>

        {/* Seção de Dados do Responsável */}
        <div className="dados-responsavel-section mt-5 p-4 bg-light rounded">
          <h5 className="label-azul mb-3">Dados do Responsável</h5>
          {alunoData.responsavel ? (
            <>
              <div className="mb-3">
                <h6 className="label-azul">Nome do Responsável</h6>
                <p className="form-control border bg-white">{alunoData.responsavel.nome || 'Não informado'}</p>
              </div>
              <div className="mb-3">
                <h6 className="label-azul">CPF do Responsável</h6>
                <p className="form-control border bg-white">{alunoData.responsavel.cpf || 'Não informado'}</p>
              </div>
              <div className="mb-3">
                <h6 className="label-azul">Telefone do Responsável</h6>
                <p className="form-control border bg-white">{alunoData.responsavel.telefone || 'Não informado'}</p>
              </div>
              <div className="mb-3">
                <h6 className="label-azul">Email do Responsável</h6>
                <p className="form-control border bg-white">{alunoData.responsavel.email || 'Não informado'}</p>
              </div>
            </>
          ) : (
            <p className="text-muted">Nenhum responsável cadastrado.</p>
          )}
        </div>


        <div className="text-end mt-4">
          <Button className="custom-button-azul5" onClick={handleAbrirModal}>
            Atualizar Dados
          </Button>
        </div>
      </Card>

      {/* Modal de Atualização */}
      <Modal show={showModal} onHide={handleFecharModal} centered className="modal-atualizar">
        <div className="registro-header-azul">
          <Modal.Title className="text-white">Atualizar Dados do Aluno</Modal.Title>
        </div>
        <Modal.Body className="py-4">
          {updateSuccess && (
            <Alert variant="success" className="mb-4">
              {updateSuccess}
            </Alert>
          )}

          {updateError && (
            <Alert variant="danger" className="mb-4">
              {updateError}
            </Alert>
          )}

          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="label-azul fw-bold">O que você deseja atualizar?</Form.Label>
              <div className="mt-2">
                <Form.Check
                  type="radio"
                  label="Email"
                  name="campoAtualizacao"
                  id="radio-email-aluno"
                  checked={campoParaAtualizar === "email"}
                  onChange={() => setCampoParaAtualizar("email")}
                  className="mb-2 radio-custom-azul"
                />
                <Form.Check
                  type="radio"
                  label="Senha"
                  name="campoAtualizacao"
                  id="radio-senha-aluno"
                  checked={campoParaAtualizar === "senha"}
                  onChange={() => setCampoParaAtualizar("senha")}
                  className="mb-2 radio-custom-azul"
                />
                <Form.Check
                  type="radio"
                  label="Telefone"
                  name="campoAtualizacao"
                  id="radio-telefone-aluno"
                  checked={campoParaAtualizar === "telefone"}
                  onChange={() => setCampoParaAtualizar("telefone")}
                  className="mb-2 radio-custom-azul"
                />
              </div>
            </Form.Group>

            {renderFormularioAtualizacao()}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
          <Button variant="outline-secondary" onClick={handleFecharModal} className="custom-button-outline px-4">
            Cancelar
          </Button>
          <Button
            className="custom-button-azul5 px-4"
            onClick={handleSubmitAtualizacao}
            disabled={!campoParaAtualizar}
          >
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DadosPessoaisAluno;