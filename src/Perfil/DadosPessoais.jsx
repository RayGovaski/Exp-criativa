import React, { useState } from 'react';
import { Card, Image, Button, Modal, Form } from 'react-bootstrap';
import './DadosPessoais.css';

const DadosPessoais = () => {
  const [imagem, setImagem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [campoParaAtualizar, setCampoParaAtualizar] = useState("");
  const [formDados, setFormDados] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
    novoEmail: "",
    novoTelefone: "",
    novoCpf: ""
  });
  
  const dadosUsuario = {
    nome: 'Maria Silva',
    cpf: '123.456.789-00',
    data_nascimento: '2007-05-15',
    telefone: '(11) 98765-4321',
    email: 'maria.silva@email.com',
    fotoPerfil: 'https://via.placeholder.com/150'
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    setFormDados({
      ...formDados,
      [e.target.name]: e.target.value
    });
  };

  const handleAbrirModal = () => {
    setShowModal(true);
    setCampoParaAtualizar("");
    setFormDados({
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
      novoEmail: "",
      novoTelefone: "",
      novoCpf: ""
    });
  };

  const handleFecharModal = () => {
    setShowModal(false);
  };

  const handleSubmitAtualizacao = () => {
    console.log("Campo para atualizar:", campoParaAtualizar);
    console.log("Dados do formulário:", formDados);
    
    setShowModal(false);
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
            />
          </Form.Group>
        );
          
      default:
        return (
          <p className="text-muted text-center">Selecione qual informação deseja atualizar</p>
        );
    }
  };

  return (
    <>
      <Card className="mb-4 shadow-sm p-4">
        <h4 className="label-azul mb-4">Dados Pessoais</h4>
        
        <div className="row mb-4">
          <div className="col-md-4 text-center">
            <div className="d-flex flex-column align-items-center">
              {/* Aqui está o container da imagem com estilo corrigido */}
              <div className="profile-image-container mb-3">
                <Image
                  src={imagem || dadosUsuario.fotoPerfil}
                  roundedCircle
                  className="profile-image"
                />
              </div>
              {/* Input de arquivo estilizado */}
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
              <Button className="custom-button-azul">Salvar Foto</Button>
            </div>
          </div>
          
          <div className="col-md-8">
            <div className="mb-3">
              <h6 className="label-azul">Nome completo</h6>
              <p className="form-control border bg-light">{dadosUsuario.nome}</p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">CPF</h6>
              <p className="form-control border bg-light">{dadosUsuario.cpf}</p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">Data de nascimento</h6>
              <p className="form-control border bg-light">
                {new Date(dadosUsuario.data_nascimento).toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">Telefone</h6>
              <p className="form-control border bg-light">{dadosUsuario.telefone}</p>
            </div>

            <div className="mb-3">
              <h6 className="label-azul">Email</h6>
              <p className="form-control border bg-light">{dadosUsuario.email}</p>
            </div>
            
            <div className="mb-3">
              <h6 className="label-azul">Senha</h6>
              <p className="form-control border bg-light">••••••••</p>
            </div>
          </div>
        </div>
        
        <div className="text-end">
          <Button className="custom-button-azul" onClick={handleAbrirModal}>
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
            className="custom-button-azul px-4" 
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