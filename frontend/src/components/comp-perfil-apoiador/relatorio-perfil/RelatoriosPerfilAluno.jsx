// src/components/comp-perfil-apoiador/relatorio-perfil/RelatoriosPerfilAluno.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import './RelatoriosPerfilAluno.css';

const RelatoriosPerfilAluno = () => {
  const { user, token } = useAuth();
  const dataAtual = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(dataAtual.getMonth() + 1);
  const [anoSelecionado, setAnoSelecionado] = useState(dataAtual.getFullYear());
  const [dadosPresenca, setDadosPresenca] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const anosDisponiveis = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  }, []);

  useEffect(() => {
    const fetchPresenceData = async () => {
      if (!user || !token || user.role !== 'aluno') {
        setError("Não autenticado como aluno ou sessão expirada. Faça login novamente.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // --- CORREÇÃO AQUI: Use ${variableName} para interpolar em template strings ---
        const response = await axios.get(`http://localhost:8000/alunos/reports/presence?mes=${mesSelecionado}&ano=${anoSelecionado}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDadosPresenca(response.data);
      } catch (err) {
        console.error("Erro ao buscar dados de presença:", err);
        setError("Falha ao carregar relatórios de presença. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPresenceData();
  }, [mesSelecionado, anoSelecionado, user, token]);

  const dadosGraficoBarras = useMemo(() => {
    const contagemAulas = {};
    dadosPresenca.forEach(registro => {
      if (!contagemAulas[registro.aula]) {
        contagemAulas[registro.aula] = { presente: 0, ausente: 0 };
      }
      if (registro.status === 'Presente') {
        contagemAulas[registro.aula].presente++;
      } else {
        contagemAulas[registro.aula].ausente++;
      }
    });

    return Object.keys(contagemAulas).map(aulaNome => ({
      name: aulaNome,
      Presente: contagemAulas[aulaNome].presente,
      Ausente: contagemAulas[aulaNome].ausente
    }));
  }, [dadosPresenca]);

  const dadosGraficoPizza = useMemo(() => {
    const totalRegistros = dadosPresenca.length;
    if (totalRegistros === 0) {
      return [];
    }
    const totalPresente = dadosPresenca.filter(r => r.status === 'Presente').length;
    const totalAusente = totalRegistros - totalPresente;

    return [
      { name: 'Presença', value: totalPresente },
      { name: 'Faltas', value: totalAusente }
    ];
  }, [dadosPresenca]);

  const coresPizza = ['#0A7D7E', '#D9534F'];

  const diasNoMes = new Date(anoSelecionado, mesSelecionado, 0).getDate();
  const primeiroDiaDoMes = new Date(anoSelecionado, mesSelecionado - 1, 1).getDay();

  const renderDiasCalendario = useMemo(() => {
    const dias = [];
    for (let i = 0; i < primeiroDiaDoMes; i++) {
      dias.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= diasNoMes; i++) {
      // Ajuste para garantir que 'mesSelecionado' tenha 2 dígitos
      const mesFormatado = String(mesSelecionado).padStart(2, '0');
      const diaFormatado = String(i).padStart(2, '0');
      const dataString = `${diaFormatado}/${mesFormatado}/${anoSelecionado}`;

      const registrosDoDia = dadosPresenca.filter(r => r.data === dataString);
      let statusDia = '';

      if (registrosDoDia.length > 0) {
        if (registrosDoDia.every(r => r.status === 'Ausente')) {
          statusDia = 'ausente';
        } else {
          statusDia = 'presente';
        }
      }

      dias.push(
        <div key={`day-${i}`} className={`calendar-day ${statusDia}`}>
          <span className="day-number">{i}</span>
          {statusDia && (
            <span className="day-status">
              {statusDia === 'presente' ? 'P' : 'A'}
            </span>
          )}
        </div>
      );
    }
    return dias;
  }, [mesSelecionado, anoSelecionado, dadosPresenca, diasNoMes, primeiroDiaDoMes]);


  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  if (loading) {
    return (
      <Card className="mb-4 shadow-sm p-4 text-center">
        <Spinner animation="border" role="status" className="mb-3" />
        <p>Carregando relatórios de presença...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-4 shadow-sm p-4">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Card>
    );
  }

  return (
    <Card className="mb-4 shadow-sm p-4">
      <h4 className="label-azul mb-4">Relatório de Desempenho e Presença</h4>

      {/* Filtros de Mês e Ano */}
      <Form className="mb-4">
        <Row>
          <Col md={4} sm={6} className="mb-3">
            <Form.Group controlId="selectMes">
              <Form.Label className="label-azul">Mês:</Form.Label>
              <Form.Select
                value={mesSelecionado}
                onChange={(e) => setMesSelecionado(Number(e.target.value))}
                className="form-control"
              >
                {nomesMeses.map((nome, index) => (
                  <option key={index + 1} value={index + 1}>{nome}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4} sm={6} className="mb-3">
            <Form.Group controlId="selectAno">
              <Form.Label className="label-azul">Ano:</Form.Label>
              <Form.Select
                value={anoSelecionado}
                onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                className="form-control"
              >
                {anosDisponiveis.map(ano => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {dadosPresenca.length === 0 && (
        <div className="alert alert-info text-center mt-3">
          Nenhum dado de presença encontrado para {nomesMeses[mesSelecionado - 1]} de {anoSelecionado}.
        </div>
      )}

      {dadosPresenca.length > 0 && (
        <>
          {/* Gráficos */}
          <div className="row mb-5">
            <div className="col-md-6 mb-4 mb-md-0">
              <h6 className="label-azul mb-3 text-center">Presença por Aula (Mês Atual)</h6>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dadosGraficoBarras}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" interval={0} angle={0} textAnchor="middle" height={80} />
                  <YAxis allowDecimals={false} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Presente" fill="#0A7D7E" name="Presença" />
                  <Bar dataKey="Ausente" fill="#D9534F" name="Falta" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="col-md-6">
              <h6 className="label-azul mb-3 text-center">Taxa Geral de Presença (Mês Atual)</h6>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dadosGraficoPizza}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {dadosGraficoPizza.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={coresPizza[index % coresPizza.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} registros`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Visualização de Calendário Simplificado */}
          <div className="mt-4 mb-5">
            <h5 className="label-azul mb-3 text-center">Calendário de Presença ({nomesMeses[mesSelecionado - 1]} / {anoSelecionado})</h5>
            <p className="text-muted text-center">
              Veja rapidamente seus dias de aula com indicadores de presença.
            </p>
            <div className="calendar-grid">
              {renderDiasCalendario}
            </div>
            <p className="text-muted text-center mt-3">
              <span className="dot presente-dot me-1"></span>Presente &nbsp;&nbsp;
              <span className="dot ausente-dot me-1"></span>Ausente &nbsp;&nbsp;
              <span className="dot neutro-dot me-1"></span>Dia de Aula
            </p>
          </div>

          {/* Tabela Detalhada de Presença */}
          <div className="mt-4">
            <h5 className="label-azul mb-3 text-center">Registros Detalhados</h5>
            <div className="table-responsive">
              <Table striped bordered hover className="presenca-table">
                <thead>
                  <tr>
                    <th>Aula</th>
                    <th>Data</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosPresenca.map((registro) => (
                    <tr key={registro.id}>
                      <td>{registro.aula}</td>
                      <td>{registro.data}</td>
                      <td className={`status-${registro.status.toLowerCase()}`}>
                        {registro.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default RelatoriosPerfilAluno;