import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify'; 
import './CriarPerfilProfessor.css';

const CriarPerfilProfessor = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    nome: "", cpf: "", sexo: "", data_nascimento: "", telefone: "", email: "", senha: "",
    data_contratacao: "", 
    cep: "", bairro: "", cidade: "", estado: "", logradouro: "", numero_residencia: ""
  });
  // const [fileName, setFileName] = useState("Nenhum arquivo selecionado"); // REMOVA ESTE ESTADO
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handleFileChange foi REMOVIDA
  // const handleFileChange = (e) => { ... }; 

  const handleCepChange = async (e) => { 
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (value.length === 8 && /^\d{8}$/.test(value)) {
      setCepLoading(true);
      setCepError(null); 
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${value}/json/`);
        if (response.data.erro) {
          setCepError("CEP não encontrado.");
          toast.error("CEP não encontrado. Verifique e digite novamente.");
          setFormData(prev => ({ ...prev, logradouro: "", bairro: "", cidade: "", estado: "" }));
        } else {
          setFormData(prev => ({
            ...prev,
            logradouro: response.data.logradouro,
            bairro: response.data.bairro,
            cidade: response.data.localidade,
            estado: response.data.uf,
          }));
          setCepError(null);
          toast.info("CEP encontrado. Endereço preenchido automaticamente.", { autoClose: 3000 });
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
        setCepError("Erro ao buscar CEP. Tente novamente.");
        toast.error("Erro ao buscar CEP. Verifique sua conexão ou digite manualmente.");
        setFormData(prev => ({ ...prev, logradouro: "", bairro: "", cidade: "", estado: "" }));
      } finally {
        setCepLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('DEBUG [CriarProfessor]: handleSubmit acionado.'); 
    setIsSubmitting(true);

    if (!isAuthenticated() || !user || user.role !== 'administrador') {
      toast.error("Acesso negado. Apenas administradores podem criar perfis de professor.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.nome || !formData.cpf || !formData.data_nascimento || !formData.email || !formData.senha || 
        !formData.logradouro || !formData.numero_residencia || !formData.cep || !formData.bairro) {
      toast.error("Por favor, preencha todos os campos obrigatórios do Professor e Endereço.");
      setIsSubmitting(false);
      return;
    }
    if (formData.senha.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres.");
        setIsSubmitting(false);
        return;
    }
    
    console.log('DEBUG [CriarProfessor]: Todas as validações front-end passaram. Preparando para enviar.');

    // --- CORREÇÃO FINAL AQUI: ENVIE formData DIRETAMENTE COMO OBJETO JSON ---
    const dataToSend = { ...formData }; // Objeto JavaScript simples
    // O currículo agora será NULL no DB. Se ele existisse no formData (como File), teríamos que removê-lo.
    // Como não há input type="file" para ele, ele não estará no formData como File.
    // O backend espera 'curriculo' no DDL, então podemos setá-lo explicitamente como null aqui
    dataToSend.curriculo = null; 

    console.log('DEBUG [CriarProfessor]: Dados para enviar:', dataToSend);

    try {
      // Axios enviará automaticamente como Content-Type: application/json
      const response = await axios.post('http://localhost:8000/administrador/professor', dataToSend, { 
        headers: {
          'Authorization': `Bearer ${token}`,
          // Não precisa mais de 'Content-Type': 'multipart/form-data'. Axios infere 'application/json'.
        }
      });

      toast.success(response.data.message);
      // Limpar formulário após sucesso
      setFormData({ 
        nome: "", cpf: "", sexo: "", data_nascimento: "", telefone: "", email: "", senha: "",
        data_contratacao: "", 
        cep: "", bairro: "", cidade: "", estado: "", logradouro: "", numero_residencia: "", 
      });
    } catch (err) {
      console.error("ERRO [CriarProfessor]: Erro ao criar professor:", err.response || err); 
      const errorMessage = err.response?.data?.error || "Erro ao criar professor. Tente novamente.";
      toast.error(errorMessage); 
    } finally {
      setIsSubmitting(false);
      console.log('DEBUG [CriarProfessor]: Submissão finalizada (isSubmitting = false).'); 
    }
  };

  return (
    <Card className="mb-4 shadow-sm p-4">
      <h4 className="label-azul mb-4">Criar Perfil de Professor</h4>
      <p>Preencha os dados para registar um novo professor na plataforma.</p>
      <Form onSubmit={handleSubmit}>
        <Row> {/* Dados Pessoais do Professor */}
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formNomeProfessor">
              <Form.Label className="label-azul">Nome Completo *</Form.Label>
              <Form.Control type="text" name="nome" value={formData.nome} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formCPFProfessor">
              <Form.Label className="label-azul">CPF *</Form.Label>
              <Form.Control type="text" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="XXX.XXX.XXX-XX" required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formSexoProfessor">
              <Form.Label className="label-azul">Sexo</Form.Label>
              <Form.Control as="select" name="sexo" value={formData.sexo} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="Outro">Outro</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formDataNascimentoProfessor">
              <Form.Label className="label-azul">Data de Nascimento *</Form.Label>
              <Form.Control type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formEmailProfessor">
              <Form.Label className="label-azul">Email *</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@professor.com" required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formSenhaProfessor">
              <Form.Label className="label-azul">Senha *</Form.Label>
              <Form.Control type="password" name="senha" value={formData.senha} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formTelefoneProfessor">
              <Form.Label className="label-azul">Telefone</Form.Label>
              <Form.Control type="text" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(XX) XXXXX-XXXX" />
            </Form.Group>
          </Col>
        </Row>

        <h5 className="label-azul mt-4 mb-3">Dados Profissionais</h5>
        <Row>
          {/* Campo de currículo REMOVIDO DO JSX */}
          <Col md={6}> {/* Esta Coluna pode ser ajustada para md={12} se não houver outra ao lado */}
            <Form.Group className="mb-3" controlId="formDataContratacaoProfessor">
              <Form.Label className="label-azul">Data de Contratação</Form.Label>
              <Form.Control type="date" name="data_contratacao" value={formData.data_contratacao} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <h5 className="label-azul mt-4 mb-3">Dados de Endereço</h5>
        <Row> {/* Ordem dos campos de endereço ajustada */}
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formCEPEndereco">
              <Form.Label className="label-azul">CEP * {cepLoading && <Spinner as="span" animation="border" size="sm" className="ms-2" />}</Form.Label>
              <Form.Control type="text" name="cep" value={formData.cep} onChange={handleCepChange} onBlur={handleCepChange} placeholder="00000-000" maxLength="8" required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formEstadoEndereco">
              <Form.Label className="label-azul">Estado</Form.Label>
              <Form.Control type="text" name="estado" value={formData.estado} onChange={handleChange} placeholder="Ex: PR" disabled={cepLoading} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formCidadeEndereco">
              <Form.Label className="label-azul">Cidade</Form.Label>
              <Form.Control type="text" name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Ex: Curitiba" disabled={cepLoading} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formBairroEndereco">
              <Form.Label className="label-azul">Bairro *</Form.Label>
              <Form.Control type="text" name="bairro" value={formData.bairro} onChange={handleChange} required disabled={cepLoading} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formLogradouroEndereco">
              <Form.Label className="label-azul">Logradouro *</Form.Label>
              <Form.Control type="text" name="logradouro" value={formData.logradouro} onChange={handleChange} required disabled={cepLoading} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formNumeroEndereco">
              <Form.Label className="label-azul">Número da Residência *</Form.Label>
              <Form.Control type="number" name="numero_residencia" value={formData.numero_residencia} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Button className="custom-button-azul5 mt-3" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              Criando...
            </>
          ) : (
            'Criar Professor'
          )}
        </Button>
      </Form>
    </Card>
  );
};

export default CriarPerfilProfessor;