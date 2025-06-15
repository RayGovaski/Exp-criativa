import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap'; // Adicione Row, Col, Spinner, Alert
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext'; // Para obter token e user
import { toast } from 'react-toastify';
import './CriarCardDoacao.css';

const CriarCardDoacao = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    nome: "", // Título da Doação
    descricao: "",
    valor_meta: "",
    // arrecadado: 0 (backend define o default)
    data_inicio: "",
    data_fim: "",
    categoria: "", // Nova categoria
    prioridade: "Média", // Default
    status: "Aberta", // Default
    imagem: null // Para o arquivo de imagem
  });
  const [fileName, setFileName] = useState("Nenhum arquivo selecionado"); // Para exibir nome do arquivo de imagem
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Opções para ENUMs
  const categoriasDisponiveis = [
    'Música', 'Artes Cênicas', 'Educação', 'Infraestrutura', 
    'Assistência Social', 'Tecnologia', 'Saúde', 'Outros'
  ];
  const prioridadesDisponiveis = ['Max', 'Média', 'Min'];
  const statusDisponiveis = ['Aberta', 'Encerrada', 'Concluída'];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imagem: file });
    setFileName(file ? file.name : "Nenhum arquivo selecionado");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validação de acesso (frontend)
    if (!isAuthenticated() || !user || user.role !== 'administrador') {
      toast.error("Acesso negado. Apenas administradores podem criar cards de doação.");
      setIsSubmitting(false);
      return;
    }

    // Validações básicas e para campos NOT NULL
    if (!formData.nome || !formData.descricao || !formData.valor_meta || !formData.categoria) {
      toast.error("Por favor, preencha Título, Descrição, Meta e Categoria.");
      setIsSubmitting(false);
      return;
    }
    if (parseFloat(formData.valor_meta) <= 0) {
      toast.error("A Meta deve ser um valor positivo.");
      setIsSubmitting(false);
      return;
    }

    const submitData = new FormData(); // Usar FormData para enviar arquivo

    // Anexar campos de texto
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined && key !== 'imagem') {
        submitData.append(key, formData[key]);
      }
    }
    // Anexar arquivo de imagem (se houver)
    if (formData.imagem) {
      submitData.append('imagem_doacao', formData.imagem); // 'imagem_doacao' deve ser o nome do campo esperado pelo Multer
    }

    try {
      const response = await axios.post('http://localhost:8000/administrador/doacao-card', submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' // <--- CRÍTICO: Para enviar arquivos
        }
      });

      toast.success(response.data.message);
      // Limpar formulário após sucesso
      setFormData({ 
        nome: "", descricao: "", valor_meta: "", data_inicio: "", data_fim: "", 
        categoria: "", prioridade: "Média", status: "Aberta", imagem: null
      });
      setFileName("Nenhum arquivo selecionado"); // Limpa o nome do arquivo exibido
    } catch (err) {
      console.error("Erro ao criar card de doação:", err.response || err);
      const errorMessage = err.response?.data?.error || "Erro ao criar card de doação. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-4 shadow-sm p-4">
      <h4 className="label-azul mb-4">Criar Card de Doação</h4>
      <p>Crie um novo card para solicitar doações com detalhes específicos.</p>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formNomeDoacao">
              <Form.Label className="label-azul">Título da Doação *</Form.Label>
              <Form.Control type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: Doação para Material Escolar" required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formDescricaoDoacao">
              <Form.Label className="label-azul">Descrição *</Form.Label>
              <Form.Control as="textarea" rows={3} name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descreva a finalidade da doação" required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formMetaDoacao">
              <Form.Label className="label-azul">Meta ($) *</Form.Label>
              <Form.Control type="number" name="valor_meta" value={formData.valor_meta} onChange={handleChange} placeholder="Ex: 5000.00" step="0.01" required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formCategoria">
              <Form.Label className="label-azul">Categoria *</Form.Label>
              <Form.Control as="select" name="categoria" value={formData.categoria} onChange={handleChange} required>
                <option value="">Selecione a Categoria</option>
                {categoriasDisponiveis.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formDataInicio">
              <Form.Label className="label-azul">Data de Início</Form.Label>
              <Form.Control type="date" name="data_inicio" value={formData.data_inicio} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formDataFim">
              <Form.Label className="label-azul">Data de Término</Form.Label>
              <Form.Control type="date" name="data_fim" value={formData.data_fim} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formPrioridade">
              <Form.Label className="label-azul">Prioridade</Form.Label>
              <Form.Control as="select" name="prioridade" value={formData.prioridade} onChange={handleChange}>
                <option value="Média">Média</option>
                <option value="Max">Máxima</option>
                <option value="Min">Mínima</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formStatus">
              <Form.Label className="label-azul">Status</Form.Label>
              <Form.Control as="select" name="status" value={formData.status} onChange={handleChange}>
                <option value="Aberta">Aberta</option>
                <option value="Encerrada">Encerrada</option>
                <option value="Concluída">Concluída</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="formImagemDoacao">
          <Form.Label className="label-azul">Imagem (Opcional - JPEG, PNG)</Form.Label>
          <div className="file-input-wrapper">
            <div className="file-input-container">
              <Form.Control
                type="file"
                name="imagem_doacao" // Este nome deve corresponder ao que o Multer espera
                onChange={handleFileChange}
                accept="image/jpeg, image/png" // Aceita apenas JPG/PNG
                className="file-input-custom"
              />
              <div className="file-input-button">Escolher Arquivo</div>
            </div>
            <span className="file-name-display">{fileName}</span>
          </div>
        </Form.Group>

        <Button className="custom-button-azul5 mt-3" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              Criando...
            </>
          ) : (
            'Criar Card'
          )}
        </Button>
      </Form>
    </Card>
  );
};

export default CriarCardDoacao;