// CriarTurma.jsx

import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

const CriarTurma = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    nome: "",
    sala: "", // Agora um ENUM
    capacidade: "",
    dia_da_semana: "", // Agora um ENUM
    hora_inicio: "",
    hora_termino: "",
    descricao: "",
    nivel: "", // Agora um ENUM
    data_inicio: "",
    data_termino: "",
    professor_id: "" 
  });
  const [professores, setProfessores] = useState([]);
  const [loadingProfessores, setLoadingProfessores] = useState(true);
  const [errorProfessores, setErrorProfessores] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valores ENUM para os dropdowns
  const salasDisponiveis = [
    'Sala Arco-Íris', 'Sala Girassol', 'Sala Estrelinha', 'Sala Sementinha', 
    'Sala Piquenique', 'Sala dos Sonhos', 'Sala Inventar', 'Sala do Amanhã', 
    'Sala Exploradores', 'Sala Conectar'
  ];
  const diasDaSemanaDisponiveis = [
    'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 
    'Sexta-feira', 'Sábado', 'Domingo'
  ];
  const niveisDisponiveis = [
    '6 a 8 anos', '9 a 10 anos', '11 a 12 anos', '13 a 14 anos', '15 a 16 anos'
  ];

  // Efeito para carregar a lista de professores
  useEffect(() => {
    const fetchProfessores = async () => {
      // Proteção no frontend para que só administradores busquem professores
      if (!isAuthenticated() || !user || user.role !== 'administrador') {
        setErrorProfessores("Acesso negado. Apenas administradores podem criar turmas e ver professores.");
        setLoadingProfessores(false);
        return;
      }

      setLoadingProfessores(true);
      setErrorProfessores(null);
      try {
        const response = await axios.get('http://localhost:8000/administrador/professores', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfessores(response.data);
      } catch (err) {
        console.error("Erro ao buscar lista de professores:", err.response || err);
        setErrorProfessores("Falha ao carregar lista de professores.");
      } finally {
        setLoadingProfessores(false);
      }
    };

    fetchProfessores();
  }, [user, token, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validações do formulário
    if (!formData.nome || !formData.sala || !formData.capacidade || !formData.dia_da_semana ||
        !formData.hora_inicio || !formData.hora_termino || !formData.nivel) { // Nível agora é obrigatório
      toast.error("Por favor, preencha todos os campos obrigatórios da turma.");
      setIsSubmitting(false);
      return;
    }
    if (parseInt(formData.capacidade) <= 0) {
      toast.error("A capacidade da turma deve ser um número positivo.");
      setIsSubmitting(false);
      return;
    }
    if (formData.hora_inicio >= formData.hora_termino) {
        toast.error("A hora de início deve ser anterior à hora de término.");
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await axios.post('http://localhost:8000/administrador/turma', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(response.data.message);
      setFormData({ // Limpar formulário após sucesso
        nome: "", sala: "", capacidade: "", dia_da_semana: "", 
        hora_inicio: "", hora_termino: "", descricao: "", nivel: "",
        data_inicio: "", data_termino: "", professor_id: ""
      });
    } catch (err) {
      console.error("Erro ao criar turma:", err.response || err);
      const errorMessage = err.response?.data?.error || "Erro ao criar turma. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProfessores) {
    return (
      <Card className="mb-4 shadow-sm p-4 text-center">
        <Spinner animation="border" role="status" className="mb-3" />
        <p>Carregando professores...</p>
      </Card>
    );
  }

  if (errorProfessores) {
    return (
      <Card className="mb-4 shadow-sm p-4">
        <Alert variant="danger" className="text-center">
          {errorProfessores}
        </Alert>
      </Card>
    );
  }

  return (
    <Card className="mb-4 shadow-sm p-4">
      <h4 className="label-azul mb-4">Criar Turma</h4>
      <p>Utilize este formulário para criar novas turmas e associar professores.</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formNomeTurma">
          <Form.Label className="label-azul">Nome da Turma *</Form.Label>
          <Form.Control 
            type="text" 
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Ex: Turma de Matemática Avançada" 
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formSala">
          <Form.Label className="label-azul">Sala *</Form.Label>
          <Form.Control 
            as="select" // Mudado para select para ENUM
            name="sala"
            value={formData.sala}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a Sala</option>
            {salasDisponiveis.map(sala => (
              <option key={sala} value={sala}>{sala}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCapacidade">
          <Form.Label className="label-azul">Capacidade *</Form.Label>
          <Form.Control 
            type="number" // Mudado para number
            name="capacidade"
            value={formData.capacidade}
            onChange={handleChange}
            placeholder="Ex: 25" 
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDiaDaSemana">
          <Form.Label className="label-azul">Dia da Semana *</Form.Label>
          <Form.Control 
            as="select" // Mudado para select para ENUM
            name="dia_da_semana"
            value={formData.dia_da_semana}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o dia</option>
            {diasDaSemanaDisponiveis.map(dia => (
              <option key={dia} value={dia}>{dia}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formHoraInicio">
          <Form.Label className="label-azul">Hora de Início *</Form.Label>
          <Form.Control 
            type="time" 
            name="hora_inicio"
            value={formData.hora_inicio}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formHoraTermino">
          <Form.Label className="label-azul">Hora de Término *</Form.Label>
          <Form.Control 
            type="time" 
            name="hora_termino"
            value={formData.hora_termino}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescricaoTurma">
          <Form.Label className="label-azul">Descrição</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3} 
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descreva o conteúdo da turma" 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formNivel">
          <Form.Label className="label-azul">Nível *</Form.Label>
          <Form.Control 
            as="select" // Mudado para select para ENUM
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o Nível</option>
            {niveisDisponiveis.map(nivel => (
              <option key={nivel} value={nivel}>{nivel}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDataInicio">
          <Form.Label className="label-azul">Data de Início</Form.Label>
          <Form.Control 
            type="date" 
            name="data_inicio"
            value={formData.data_inicio}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDataTermino">
          <Form.Label className="label-azul">Data de Término</Form.Label>
          <Form.Control 
            type="date" 
            name="data_termino"
            value={formData.data_termino}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formProfessorResponsavel">
          <Form.Label className="label-azul">Professor Responsável (Opcional)</Form.Label>
          <Form.Control 
            as="select" 
            name="professor_id"
            value={formData.professor_id}
            onChange={handleChange}
          >
            <option value="">Selecione um Professor</option>
            {professores.map(prof => (
              <option key={prof.id} value={prof.id}>{prof.nome}</option>
            ))}
          </Form.Control>
          {professores.length === 0 && !loadingProfessores && !errorProfessores && (
            <p className="text-muted mt-2">Nenhum professor disponível. Cadastre um professor primeiro.</p>
          )}
        </Form.Group>

        <Button className="custom-button-azul5 mt-3" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              Criando...
            </>
          ) : (
            'Criar Turma'
          )}
        </Button>
      </Form>
    </Card>
  );
};

export default CriarTurma;