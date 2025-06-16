/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Card, Image, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap'; // Importe Spinner
import { useAuth } from '../../../context/AuthContext'; // Para obter user e token
import axios from 'axios'; // Para fazer requisições HTTP
import './DadosPessoaisAluno.css';

const DadosPessoaisAluno = () => {
  const { user, token, logout } = useAuth(); // Obtenha user e token do AuthContext
  const [alunoData, setAlunoData] = useState(null); // Estado para os dados reais do aluno
  const [loading, setLoading] = useState(true); // Controla o estado de carregamento
  const [error, setError] = useState(null); // Controla mensagens de erro
  const [imagem, setImagem] = useState(null); // Para pré-visualização da imagem local
  const [imagemFile, setImagemFile] = useState(null); // Para armazenar o arquivo da imagem para upload
  const [uploading, setUploading] = useState(false); // Para simular estado de upload
  const [showModal, setShowModal] = useState(false);
  const [campoParaAtualizar, setCampoParaAtualizar] = useState("");
  const [formDados, setFormDados] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
    novoEmail: "",
    novoTelefone: ""
  });
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [updateError, setUpdateError] = useState("");

  // URL base para buscar a foto do aluno
  const ALUNO_PHOTO_BASE_URL = 'http://localhost:8000/aluno/foto/'; // Você precisará de uma rota similar para aluno

  // Efeito para buscar os dados do aluno ao montar o componente
  useEffect(() => {
    console.log('DEBUG [DadosPessoaisAluno]: useEffect disparado.');
    console.log('DEBUG [DadosPessoaisAluno]: User no contexto:', user);
    console.log('DEBUG [DadosPessoaisAluno]: Token no contexto:', token ? 'presente' : 'ausente');

    const fetchAlunoData = async () => {
      console.log('DEBUG [DadosPessoaisAluno]: fetchAlunoData iniciado.');
      if (!token || !user || user.role !== 'aluno') {
        console.log('DEBUG [DadosPessoaisAluno]: Não autenticado como aluno ou token/user inválido. User.role:', user?.role);
        setError("Não autenticado como aluno ou sessão expirada. Por favor, faça login novamente.");
        setLoading(false);
        // Não redirecionar aqui diretamente para ver o erro na tela.
        return;
      }

      try {
        setLoading(true);
        console.log('DEBUG [DadosPessoaisAluno]: Tentando requisição GET para /aluno/profile...');
        const response = await axios.get('http://localhost:8000/aluno/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('DEBUG [DadosPessoaisAluno]: Resposta da API /aluno/profile:', response.data);
        setAlunoData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("ERRO [DadosPessoaisAluno]: Erro ao buscar dados do aluno:", err);
        setError("Falha ao carregar dados do aluno. Por favor, recarregue a página.");
        setLoading(false);
      }
    };

    fetchAlunoData();
  }, [token, user]); 

  // Function to handle image change
  const handleImagemChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagemFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagem(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to get the profile image source
  const getProfileImageSrc = () => {
    if (imagem) { // Mantém a pré-visualização de um novo upload
      return imagem;
    }
    // Verifica se alunoData existe e se o campo 'foto' não está vazio/nulo
    if (alunoData && alunoData.foto) { 
      // Esta URL agora vai funcionar, pois criaremos a rota no backend
      return `${ALUNO_PHOTO_BASE_URL}${alunoData.id}?t=${new Date().getTime()}`;
    }
    // Fallback para a imagem padrão
    return 'https://placehold.co/150x150?text=Aluno';
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
    const formData = new FormData();
    formData.append('foto', imagemFile); // 'foto' deve ser o nome do campo esperado pelo backend (multer)

    try {
        const response = await axios.put('http://localhost:8000/aluno/update-foto', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        if (response.status === 200) {
            setImagem(null); // Limpa a pré-visualização local
            setImagemFile(null); // Limpa o arquivo local
            // Atualiza os dados do aluno com o novo foto_path
            setAlunoData(prevData => ({ ...prevData, foto_path: response.data.photoPath })); 
            alert('Foto atualizada com sucesso!');
        }
    } catch (error) {
        console.error("Erro ao atualizar foto do aluno:", error);
        let errorMessage = "Falha ao atualizar foto. Por favor, tente novamente.";
        if (error.response && error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
        }
        alert(errorMessage);
    } finally {
        setUploading(false);
    }
  };


  const handleSubmitAtualizacao = async () => {
    setUpdateSuccess("");
    setUpdateError("");

    try {
      let endpoint = '';
      let data = {};
      
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
          endpoint = 'http://localhost:8000/aluno/update-senha'; // Rota para atualizar senha do aluno
          data = {
            senhaAtual: formDados.senhaAtual,
            novaSenha: formDados.novaSenha
          };
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
          endpoint = 'http://localhost:8000/aluno/update-email'; // Rota para atualizar email do aluno
          data = { email: formDados.novoEmail };
          break; }
        case "telefone":
          if (!formDados.novoTelefone) {
            setUpdateError("Telefone não pode estar vazio.");
            return;
          }
          endpoint = 'http://localhost:8000/aluno/update-telefone'; // Rota para atualizar telefone do aluno
          data = { telefone: formDados.novoTelefone };
          break;
        default:
          setUpdateError("Selecione o que deseja atualizar.");
          return;
      }
      
      const response = await axios.put(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
   
      setAlunoData(prevData => {
        const updatedData = { ...prevData };
        if (campoParaAtualizar === "email") {
          updatedData.email = formDados.novoEmail;
        } else if (campoParaAtualizar === "telefone") {
          updatedData.telefone = formDados.novoTelefone;
        }
        return updatedData;
      });
      
      setUpdateSuccess(`${campoParaAtualizar.charAt(0).toUpperCase() + campoParaAtualizar.slice(1)} atualizado com sucesso!`);
      
      setFormDados({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
        novoEmail: "",
        novoTelefone: ""
      });
      
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
      
    } catch (error) {
      console.error("Erro ao atualizar dados do aluno:", error);
      let errorMessage = "Erro ao atualizar dados. Tente novamente.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      setUpdateError(errorMessage);
    }
  };

  const handleLogout = () => {
    logout(); // Chama a função de logout do AuthContext
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
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

  if (!alunoData) {
    return (
      <div className="alert alert-warning" role="alert">
        Dados do aluno não disponíveis. Por favor, faça login novamente.
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
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/150x150?text=Aluno'; // Fallback mais robusto
                  }}
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
               {/* Outros campos do responsável, se existirem e quiser exibi-los */}
               {alunoData.responsavel.grau_parentesco && (
                 <div className="mb-3">
                   <h6 className="label-azul">Grau de Parentesco</h6>
                   <p className="form-control border bg-white">{alunoData.responsavel.grau_parentesco}</p>
                 </div>
               )}
               {alunoData.responsavel.profissao && (
                 <div className="mb-3">
                   <h6 className="label-azul">Profissão</h6>
                   <p className="form-control border bg-white">{alunoData.responsavel.profissao}</p>
                 </div>
               )}
               {alunoData.responsavel.renda_familiar !== null && (
                 <div className="mb-3">
                   <h6 className="label-azul">Renda Familiar</h6>
                   <p className="form-control border bg-white">R$ {parseFloat(alunoData.responsavel.renda_familiar).toFixed(2).replace('.', ',')}</p>
                 </div>
               )}
               {/* Endereço do responsável, se disponível */}
               {alunoData.responsavel.endereco && (
                 <div className="mb-3">
                   <h6 className="label-azul">Endereço do Responsável</h6>
                   <p className="form-control border bg-white">
                     {alunoData.responsavel.endereco.logradouro}, {alunoData.responsavel.endereco.numero_residencia} - {alunoData.responsavel.endereco.cep}
                     {alunoData.responsavel.endereco.cidade && `, ${alunoData.responsavel.endereco.cidade}`}
                     {alunoData.responsavel.endereco.estado && `/${alunoData.responsavel.endereco.estado}`}
                     {alunoData.responsavel.endereco.pais && `, ${alunoData.responsavel.endereco.pais}`}
                   </p>
                 </div>
               )}
            </>
          ) : (
            <p className="text-muted">Nenhum responsável cadastrado ou associado.</p>
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