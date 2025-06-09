/* eslint-disable no-unused-vars */
import React, { useState } from 'react'; // Re-adicionado useState
import { Card, Image, Button, Modal, Form, Alert } from 'react-bootstrap'; // Re-adicionado Modal, Form, Alert
// Removidos useAuth e axios (mantendo sem integração real)
import './DadosPessoaisProfessor.css';

const DadosPessoaisProfessor = () => {
  // --- Dados do Professor Mockados (Simulados) ---
  const initialProfessorData = {
    nome: "Prof. Carlos Alberto Mendes",
    data_nascimento: "1980-03-15", // Formato YYYY-MM-DD
    cpf: "010.202.303-44",
    telefone: "(41) 99123-4567",
    email: "carlos.mendes@escola.com",
    // Simulação de foto de perfil
    foto_url: 'https://via.placeholder.com/150?text=Professor',
    disciplina: "Matemática e Física" // Novo campo para professor
  };

  const [professorData, setProfessorData] = useState(initialProfessorData); // Agora useState com dados mockados
  const [loading, setLoading] = useState(false); // Sempre false
  const [error, setError] = useState(null); // Sempre null
  const [imagem, setImagem] = useState(null); // Para pré-visualização da imagem local
  const [imagemFile, setImagemFile] = useState(null); // Para armazenar o arquivo da imagem
  const [uploading, setUploading] = useState(false); // Para simular estado de upload
  const [showModal, setShowModal] = useState(false); // Para controlar o modal de atualização
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

  // Função para lidar com a mudança da imagem (simulada)
  const handleImagemChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagemFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagem(event.target.result); // Define a pré-visualização da imagem local
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para obter a URL da imagem de perfil
  const getProfileImageSrc = () => {
    // Se há uma imagem temporária sendo enviada, mostra essa primeiro
    if (imagem) {
      return imagem;
    }
    // Caso contrário, usa a URL mockada do professorData
    return professorData.foto_url;
  };

  // Função para simular o salvamento da foto
  const handleSalvarFoto = async () => {
    if (!imagemFile) {
      alert('Por favor, selecione uma foto primeiro.');
      return;
    }
    setUploading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay de rede

    setImagem(null); // Limpa a pré-visualização
    setImagemFile(null); // Limpa o arquivo
    // Em um cenário real, você atualizaria professorData.foto_url aqui
    alert('Foto atualizada com sucesso (simulado)!');
    setUploading(false);
  };

  // Função para lidar com mudanças nos inputs do formulário do modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDados(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Função para abrir o modal de atualização
  const handleAbrirModal = () => {
    setShowModal(true);
    setCampoParaAtualizar(""); // Reseta a seleção de campo
    setFormDados({ // Reseta os dados do formulário
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
      novoEmail: "",
      novoTelefone: ""
    });
    setUpdateSuccess(""); // Limpa mensagens anteriores
    setUpdateError("");
  };

  // Função para fechar o modal de atualização
  const handleFecharModal = () => {
    setShowModal(false);
  };

  // Função para simular o envio das atualizações (email, telefone, senha)
  const handleSubmitAtualizacao = async () => {
    setUpdateSuccess("");
    setUpdateError("");

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de rede

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
          // Lógica de atualização de senha simulada (apenas mensagem)
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
          // Lógica de atualização de email simulada (atualiza estado local)
          setProfessorData(prevData => ({ ...prevData, email: formDados.novoEmail }));
          successMessage = "Email atualizado com sucesso (simulado)!";
          break; }
        case "telefone":
          if (!formDados.novoTelefone) {
            setUpdateError("Telefone não pode estar vazio.");
            return;
          }
          // Lógica de atualização de telefone simulada (atualiza estado local)
          setProfessorData(prevData => ({ ...prevData, telefone: formDados.novoTelefone }));
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

  // Função mockada para logout
  const handleLogout = () => {
    alert("Logout simulado!");
  };

  // Renderização do formulário de atualização dentro do modal
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

  // As telas de loading e erro são desnecessárias se os dados são mockados
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
        <h4 className="label-azul mb-4">Dados Pessoais do Professor</h4>

        <div className="row mb-4">
          <div className="col-md-4 text-center">
            <div className="d-flex flex-column align-items-center">
              <div className="profile-image-container-professor mb-3">
                <Image
                  src={getProfileImageSrc()}
                  roundedCircle
                  className="profile-image-professor"
                  alt="Foto de perfil do professor"
                  // Não há onError, pois a URL é fixa e deve funcionar
                />
              </div>
              <div className="custom-file-input mb-3">
                <input
                  type="file"
                  id="file-input-professor"
                  className="d-none"
                  onChange={handleImagemChange}
                  accept="image/*"
                />
                <label htmlFor="file-input-professor" className="btn btn-outline-secondary">
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
              <h6 className="label-azul">Nome completo</h6>
              <p className="form-control border bg-light">{professorData.nome}</p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">Data de nascimento</h6>
              <p className="form-control border bg-light">
                {professorData.data_nascimento
                  ? new Date(professorData.data_nascimento).toLocaleDateString('pt-BR')
                  : 'Não informado'}
              </p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">CPF</h6>
              <p className="form-control border bg-light">{professorData.cpf || 'Não informado'}</p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">Telefone</h6>
              <p className="form-control border bg-light">{professorData.telefone || 'Não informado'}</p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">Email</h6>
              <p className="form-control border bg-light">{professorData.email || 'Não informado'}</p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">Disciplina(s)</h6>
              <p className="form-control border bg-light">{professorData.disciplina || 'Não informado'}</p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">Senha</h6>
              <p className="form-control border bg-light">••••••••</p>
            </div>
          </div>
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
          <Modal.Title className="text-white">Atualizar Dados do Professor</Modal.Title>
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
              <Form.Label className="label-azul fw-semibold pipipi">O que você deseja atualizar?</Form.Label>
              <div className="mt-2">
                <Form.Check
                  type="radio"
                  label="Email"
                  name="campoAtualizacao"
                  id="radio-email-professor" // ID específico para professor
                  checked={campoParaAtualizar === "email"}
                  onChange={() => setCampoParaAtualizar("email")}
                  className="mb-2 radio-custom-azul"
                />
                <Form.Check
                  type="radio"
                  label="Senha"
                  name="campoAtualizacao"
                  id="radio-senha-professor" // ID específico para professor
                  checked={campoParaAtualizar === "senha"}
                  onChange={() => setCampoParaAtualizar("senha")}
                  className="mb-2 radio-custom-azul"
                />
                <Form.Check
                  type="radio"
                  label="Telefone"
                  name="campoAtualizacao"
                  id="radio-telefone-professor" // ID específico para professor
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

export default DadosPessoaisProfessor;