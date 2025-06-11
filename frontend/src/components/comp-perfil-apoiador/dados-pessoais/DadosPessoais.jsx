import React, { useState, useEffect } from 'react';
import { Card, Image, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import './DadosPessoais.css';

const DadosPessoais = () => {
  // eslint-disable-next-line no-unused-vars
  const { user, token, updateAuthData, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagem, setImagem] = useState(null);
  const [imagemFile, setImagemFile] = useState(null);
  const [uploading, setUploading] = useState(false);
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
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/apoiador/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Falha ao carregar dados do usuário. Por favor, recarregue a página.");
        setLoading(false);
      }
    };
    
    if (token) {
      fetchUserData();
    }
  }, [token]);

  // Function to handle image change
  const handleImagemChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagemFile(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagem(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to get the profile image source
  const getProfileImageSrc = () => {
    // If there's a temporary image being uploaded, show that first
    if (imagem) {
        return imagem;
    }
    
    // If the user has an ID, try to fetch from server
    if (userData && userData.id) {
        // Add timestamp to prevent caching issues
        return `http://localhost:8000/apoiador/foto/${userData.id}?t=${new Date().getTime()}`;
    }
    
    // Default placeholder image if no image is available
    return 'https://via.placeholder.com/150?text=Perfil';
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
    
    try {
        setUploading(true);
        console.log('Uploading file:', imagemFile); // Debug log
        
        const formData = new FormData();
        formData.append('foto', imagemFile);
        
        // Log formData contents for debugging
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        
        const response = await axios.put(
            'http://localhost:8000/apoiador/update-foto',
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        
        console.log('Upload response:', response.data); // Debug log
        
        if (response.status === 200) {
            // Clear the temporary preview
            setImagem(null);
            setImagemFile(null);
            
            // Force refresh the profile image by updating the timestamp
            const imageElement = document.querySelector('.profile-image');
            if (imageElement) {
                const currentSrc = imageElement.src;
                const newSrc = currentSrc.split('?')[0] + '?' + new Date().getTime();
                imageElement.src = newSrc;
            }
            
            // Optionally refresh user data
            try {
                const userResponse = await axios.get('http://localhost:8000/apoiador/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(userResponse.data);
            } catch (refreshError) {
                console.warn('Could not refresh user data:', refreshError);
            }
            
            alert('Foto atualizada com sucesso!');
        }
    } catch (error) {
        console.error("Error updating profile photo:", error);
        
        let errorMessage = "Falha ao atualizar foto. Por favor, tente novamente.";
        
        if (error.response) {
            console.log('Error response:', error.response.data);
            if (error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }
        } else if (error.request) {
            console.log('Error request:', error.request);
            errorMessage = "Erro de conexão. Verifique sua internet.";
        } else {
            console.log('Error message:', error.message);
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
          endpoint = 'http://localhost:8000/apoiador/update-senha';
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
          endpoint = 'http://localhost:8000/apoiador/update-email';
          data = { email: formDados.novoEmail };
          break; }
        case "telefone":
          if (!formDados.novoTelefone) {
            setUpdateError("Telefone não pode estar vazio.");
            return;
          }
          endpoint = 'http://localhost:8000/apoiador/update-telefone';
          data = { telefone: formDados.novoTelefone };
          break;
        default:
          setUpdateError("Selecione o que deseja atualizar.");
          return;
      }
      
      const response = await axios.put(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
   
      setUserData(prevData => {
        const updatedData = { ...prevData };
        
        if (campoParaAtualizar === "email") {
          updatedData.email = formDados.novoEmail;
          if (response.data.token) {
            if (typeof updateAuthData === 'function') {
              updateAuthData(response.data.token);
            }
          }
        } else if (campoParaAtualizar === "telefone") {
          updatedData.telefone = formDados.novoTelefone;
        }
        
        return updatedData;
      });
      
      setUpdateSuccess(`${campoParaAtualizar.charAt(0).toUpperCase() + campoParaAtualizar.slice(1)} atualizado com sucesso!`);
      
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
      
    } catch (error) {
      console.error("Error updating data:", error);
      let errorMessage = "Erro ao atualizar dados. Tente novamente.";
      
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      
      setUpdateError(errorMessage);
    }
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

  if (!userData) {
    return (
      <div className="alert alert-warning" role="alert">
        Dados do usuário não disponíveis. Por favor, faça login novamente.
      </div>
    );
  }

  return (
    <>
      <Card className="mb-4 shadow-sm p-4">
        <h4 className="label-azul mb-4">Dados Pessoais</h4>
        
        <div className="row mb-4">
          <div className="col-md-4 text-center">
            <div className="d-flex flex-column align-items-center">
              <div className="profile-image-container mb-3">
                <Image
                  src={getProfileImageSrc()}
                  roundedCircle
                  className="profile-image"
                  alt="Foto de perfil"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=Perfil';
                  }}
                />
              </div>
              <div className="custom-file-input mb-3">
                <input 
                  type="file" 
                  id="file-input" 
                  className="d-none"
                  onChange={handleImagemChange} 
                  accept="image/*"
                />
                <label htmlFor="file-input" className="btn btn-outline-secondary">
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
              <p className="form-control border bg-light">{userData.nome}</p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">CPF</h6>
              <p className="form-control border bg-light">{userData.cpf}</p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">Data de nascimento</h6>
              <p className="form-control border bg-light">
                {userData.data_nascimento 
                  ? new Date(userData.data_nascimento).toLocaleDateString('pt-BR')
                  : 'Não informado'}
              </p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">Telefone</h6>
              <p className="form-control border bg-light">{userData.telefone || 'Não informado'}</p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">Email</h6>
              <p className="form-control border bg-light">{userData.email}</p>
            </div>
            
            <div className="mb-3">
              <h6 className="label-azul">Senha</h6>
              <p className="form-control border bg-light">••••••••</p>
            </div>
          </div>
        </div>
        
        <div className="text-end">
          <Button className="custom-button-azul5" onClick={handleAbrirModal}>
            Atualizar Dados
          </Button>
        </div>
      </Card>

      {/* Modal de Atualização */}
      <Modal show={showModal} onHide={handleFecharModal} centered className="modal-atualizar">
        <div className="registro-header-azul">
          <Modal.Title className="text-white">Atualizar Dados</Modal.Title>
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
                  id="radio-email"
                  checked={campoParaAtualizar === "email"}
                  onChange={() => setCampoParaAtualizar("email")}
                  className="mb-2 radio-custom-azul"
                />
                <Form.Check
                  type="radio"
                  label="Senha"
                  name="campoAtualizacao"
                  id="radio-senha"
                  checked={campoParaAtualizar === "senha"}
                  onChange={() => setCampoParaAtualizar("senha")}
                  className="mb-2 radio-custom-azul"
                />
                <Form.Check
                  type="radio"
                  label="Telefone"
                  name="campoAtualizacao"
                  id="radio-telefone"
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

export default DadosPessoais;