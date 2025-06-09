import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap'; // Removido 'Alert'
import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // Mantenha isso se for usar axios real depois
import { toast } from 'react-toastify'; // Importa a função toast
import './RegistroProfessor.css';

const RegistroProfessor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    sexo: '',
    data_nascimento: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    nacionalidade: '',
    graduacao: '',
    curriculo: null,
    foto: null,
    logradouro: '',
    numero_residencia: '',
    cep: '',
    cidade: '',
    estado: '',
    pais: ''
  });

  const [loading, setLoading] = useState(false);
  // Removido os estados 'error' e 'success' locais, agora usaremos toast

  const [previewFoto, setPreviewFoto] = useState(null);
  const [nomeArquivoCurriculo, setNomeArquivoCurriculo] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (name === "foto") {
      setFormData({ ...formData, foto: file });
      if (file) {
        setPreviewFoto(URL.createObjectURL(file));
      } else {
        setPreviewFoto(null);
      }
    } else if (name === "curriculo") {
      setFormData({ ...formData, curriculo: file });
      if (file) {
        setNomeArquivoCurriculo(file.name);
      } else {
        setNomeArquivoCurriculo('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Não precisa mais de setError(null) e setSuccess(null) aqui

    // Validação de senhas
    if (formData.senha !== formData.confirmarSenha) {
      toast.error("As senhas não coincidem!");
      setLoading(false);
      return;
    }
    // Validação de senha mínima
    if (formData.senha.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres!");
      setLoading(false);
      return;
    }
    // Validação de currículo
    if (!formData.curriculo) {
      toast.error("Por favor, anexe o currículo!");
      setLoading(false);
      return;
    }

    // Validação de campos obrigatórios (repetindo a lógica do Apoiador)
    // Embora os campos tenham 'required' no HTML, vamos remover para o toast funcionar
    // e teremos uma validação JavaScript mais robusta aqui.
    if (
      !formData.nome || !formData.cpf || !formData.data_nascimento ||
      !formData.email || !formData.senha || !formData.graduacao ||
      !formData.logradouro || !formData.numero_residencia ||
      !formData.cep || !formData.cidade || !formData.estado
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }


    const dataToSubmit = new FormData();
    for (const key in formData) {
      if (key !== 'confirmarSenha' && formData[key] !== null) {
        dataToSubmit.append(key, formData[key]);
      }
    }

    toast.info("Registrando professor..."); // Notificação de informação

    // --- SIMULAÇÃO DE REGISTRO SEM BACKEND ---
    await new Promise(resolve => setTimeout(resolve, 2000));

    const isSuccess = Math.random() > 0.3; // Simula sucesso ou falha

    if (isSuccess) {
      toast.success("Cadastro de professor realizado com sucesso!");
      setFormData({
        nome: '', cpf: '', sexo: '', data_nascimento: '', telefone: '', email: '',
        senha: '', confirmarSenha: '', nacionalidade: '', graduacao: '', curriculo: null, foto: null,
        logradouro: '', numero_residencia: '', cep: '', cidade: '', estado: '', pais: ''
      });
      setPreviewFoto(null);
      setNomeArquivoCurriculo('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      toast.error("Falha no cadastro. Verifique os dados e tente novamente (erro simulado).");
    }

    setLoading(false);
  };

  return (
    <div className="registro-professor-fundo">
      <Container className="registro-professor-container my-5">
        <Card className="p-4 shadow-lg registro-professor-card">
          <div className="registro-professor-header">
            <h2 className="registro-professor-title text-white mb-0">Cadastro de Professor</h2>
          </div>
          <Card.Body className="py-4">
            {/* REMOVIDO: {error && <Alert variant="danger">{error}</Alert>} */}
            {/* REMOVIDO: {success && <Alert variant="success">{success}</Alert>} */}

            <Form onSubmit={handleSubmit}>
              {/* Seção Dados Pessoais */}
              <h5 className="form-section-title">Dados Pessoais</h5>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="formNome">
                  <Form.Label>Nome Completo <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    // REMOVIDO: required (vamos usar a validação JS com toast)
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="formCPF">
                  <Form.Label>CPF <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    maxLength="11"
                    pattern="\d{11}"
                    title="CPF deve conter 11 dígitos numéricos"
                    // REMOVIDO: required
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="formDataNascimento">
                  <Form.Label>Data de Nascimento <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    name="data_nascimento"
                    value={formData.data_nascimento}
                    onChange={handleChange}
                    // REMOVIDO: required
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formSexo">
                  <Form.Label>Sexo</Form.Label>
                  <Form.Select name="sexo" value={formData.sexo} onChange={handleChange}>
                    <option value="">Selecione...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="Outro">Outro</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formNacionalidade">
                  <Form.Label>Nacionalidade</Form.Label>
                  <Form.Control
                    type="text"
                    name="nacionalidade"
                    value={formData.nacionalidade}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="formTelefone">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    maxLength="15"
                    placeholder="(XX) XXXXX-XXXX"
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="formEmail">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    // REMOVIDO: required
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="formGraduacao">
                  <Form.Label>Graduação <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="graduacao"
                    value={formData.graduacao}
                    onChange={handleChange}
                    // REMOVIDO: required
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="formCurriculo">
                  <Form.Label>Currículo <span className="text-danger">*</span></Form.Label>
                  <div className="curriculo-upload-field">
                    <Form.Label htmlFor="uploadCurriculo" className="upload-curriculo-button w-100 mb-0">
                      {nomeArquivoCurriculo || 'Anexar Documento'}
                    </Form.Label>
                    <Form.Control
                      type="file"
                      id="uploadCurriculo"
                      name="curriculo"
                      onChange={handleFileChange}
                      className="d-none"
                      accept=".pdf,.doc,.docx"
                      // REMOVIDO: required (validação via JS)
                    />
                  </div>
                </Form.Group>
              </Row>

              <Row className="mb-4">
                <Form.Group as={Col} md="6" controlId="formSenha">
                  <Form.Label>Senha <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    // REMOVIDO: required
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="formConfirmarSenha">
                  <Form.Label>Confirmar Senha <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    // REMOVIDO: required
                  />
                </Form.Group>
              </Row>

              {/* Seção Dados de Endereço */}
              <h5 className="form-section-title mt-4">Dados de Endereço</h5>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="formCEP">
                  <Form.Label>CEP <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    maxLength="8"
                    pattern="\d{8}"
                    title="CEP deve conter 8 dígitos numéricos"
                    // REMOVIDO: required
                  />
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="formLogradouro">
                  <Form.Label>Logradouro <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="logradouro"
                    value={formData.logradouro}
                    onChange={handleChange}
                    // REMOVIDO: required
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="formNumeroResidencia">
                  <Form.Label>Número <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="numero_residencia"
                    value={formData.numero_residencia}
                    onChange={handleChange}
                    // REMOVIDO: required
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formCidade">
                  <Form.Label>Cidade <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    // REMOVIDO: required
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="formEstado">
                  <Form.Label>Estado <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    // REMOVIDO: required
                  />
                </Form.Group>
              </Row>

              <Form.Group className="mb-4" controlId="formPais">
                <Form.Label>País</Form.Label>
                <Form.Control
                  type="text"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Seção Upload de Foto */}
              <h5 className="form-section-title mt-4">Foto de Perfil</h5>
              <Form.Group controlId="formFoto" className="mb-4 d-flex flex-column align-items-center">
                {previewFoto && (
                  <div className="foto-preview-container mb-3">
                    <img src={previewFoto} alt="Pré-visualização da foto" className="foto-preview" />
                  </div>
                )}
                <Form.Label htmlFor="uploadFoto" className="btn btn-outline-primary upload-button">
                  {formData.foto ? 'Alterar Foto' : 'Escolher Foto'}
                </Form.Label>
                <Form.Control
                  type="file"
                  id="uploadFoto"
                  name="foto"
                  onChange={handleFileChange}
                  className="d-none"
                  accept="image/*"
                />
                {formData.foto && <span className="text-muted mt-2">{formData.foto.name}</span>}
              </Form.Group>

              <div className="text-center">
                <Button variant="primary" type="submit" disabled={loading} className="custom-submit-button">
                  {loading ? 'Registrando...' : 'Registrar'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default RegistroProfessor;