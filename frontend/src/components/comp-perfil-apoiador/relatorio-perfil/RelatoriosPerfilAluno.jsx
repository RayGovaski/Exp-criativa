// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Form, Row, Col } from 'react-bootstrap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './RelatoriosPerfilAluno.css';

// --- DADOS SIMULADOS MAIS COMPLEXOS ---
// Dados de presença detalhados para múltiplas aulas e meses/dias
const todosDadosPresenca = [
  // Junho de 2024
  { id: 1, aula: 'Matemática Aplicada', data: '03/06/2024', status: 'Presente' },
  { id: 2, aula: 'Matemática Aplicada', data: '05/06/2024', status: 'Presente' },
  { id: 3, aula: 'Português: Escrita Criativa', data: '04/06/2024', status: 'Ausente' },
  { id: 4, aula: 'Português: Escrita Criativa', data: '06/06/2024', status: 'Presente' },
  { id: 5, aula: 'História do Brasil', data: '03/06/2024', status: 'Presente' },
  { id: 6, aula: 'História do Brasil', data: '05/06/2024', status: 'Presente' },
  { id: 7, aula: 'Ciências: O Corpo Humano', data: '04/06/2024', status: 'Presente' },
  { id: 8, aula: 'Ciências: O Corpo Humano', data: '06/06/2024', status: 'Ausente' },
  { id: 9, aula: 'Matemática Aplicada', data: '10/06/2024', status: 'Presente' },
  { id: 10, aula: 'Português: Escrita Criativa', data: '11/06/2024', status: 'Presente' },
  { id: 11, aula: 'Ciências: O Corpo Humano', data: '13/06/2024', status: 'Presente' },
  { id: 12, aula: 'História do Brasil', data: '12/06/2024', status: 'Ausente' },

  // Julho de 2024
  { id: 13, aula: 'Matemática Aplicada', data: '01/07/2024', status: 'Presente' },
  { id: 14, aula: 'Português: Escrita Criativa', data: '02/07/2024', status: 'Presente' },
  { id: 15, aula: 'Ciências: O Corpo Humano', data: '03/07/2024', status: 'Presente' },
  { id: 16, aula: 'Matemática Aplicada', data: '08/07/2024', status: 'Presente' },
  { id: 17, aula: 'Português: Escrita Criativa', data: '09/07/2024', status: 'Presente' },
  { id: 18, aula: 'Ciências: O Corpo Humano', data: '10/07/2024', status: 'Ausente' },

  // Junho de 2025 (Exemplo para o ano atual)
  { id: 19, aula: 'Matemática Aplicada', data: '03/06/2025', status: 'Presente' },
  { id: 20, aula: 'Português: Escrita Criativa', data: '04/06/2025', status: 'Presente' },
  { id: 21, aula: 'História do Brasil', data: '05/06/2025', status: 'Ausente' },
  { id: 22, aula: 'Ciências: O Corpo Humano', data: '06/06/2025', status: 'Presente' },
  { id: 23, aula: 'Matemática Aplicada', data: '10/06/2025', status: 'Presente' },
  { id: 24, aula: 'Português: Escrita Criativa', data: '11/06/2025', status: 'Presente' },
  { id: 25, aula: 'História do Brasil', data: '12/06/2025', status: 'Presente' },
  { id: 26, aula: 'Ciências: O Corpo Humano', data: '13/06/2025', status: 'Ausente' },
];

const RelatoriosPerfilAluno = () => {
  const dataAtual = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(dataAtual.getMonth() + 1); // Mês atual (1-12)
  const [anoSelecionado, setAnoSelecionado] = useState(dataAtual.getFullYear()); // Ano atual

  // Gerar lista de anos para o seletor (ex: 5 anos para trás e 1 para frente)
  const anosDisponiveis = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  }, []);

  // Filtrar dados com base no mês e ano selecionados
  const dadosFiltrados = useMemo(() => {
    return todosDadosPresenca.filter(registro => {
      // eslint-disable-next-line no-unused-vars
      const [dia, mes, ano] = registro.data.split('/').map(Number);
      return mes === mesSelecionado && ano === anoSelecionado;
    });
  }, [mesSelecionado, anoSelecionado]);

  // Preparar dados para o gráfico de barras (Presença por Aula)
  const dadosGraficoBarras = useMemo(() => {
    const contagemAulas = {}; // { 'Matemática': { presente: X, ausente: Y } }
    dadosFiltrados.forEach(registro => {
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
  }, [dadosFiltrados]);

  // Preparar dados para o gráfico de pizza (Porcentagem Geral de Presença)
  const dadosGraficoPizza = useMemo(() => {
    const totalRegistros = dadosFiltrados.length;
    if (totalRegistros === 0) {
      return []; // Retorna vazio se não houver dados
    }
    const totalPresente = dadosFiltrados.filter(r => r.status === 'Presente').length;
    const totalAusente = totalRegistros - totalPresente;

    return [
      { name: 'Presença', value: totalPresente },
      { name: 'Faltas', value: totalAusente }
    ];
  }, [dadosFiltrados]);

  const coresPizza = ['#0A7D7E', '#D9534F']; // Verde para Presença, Vermelho para Faltas

  // --- Lógica para o Calendário Simplificado ---
  const diasNoMes = new Date(anoSelecionado, mesSelecionado, 0).getDate(); // Número de dias no mês
  const primeiroDiaDoMes = new Date(anoSelecionado, mesSelecionado - 1, 1).getDay(); // Dia da semana do 1º dia (0=Dom, 1=Seg...)

  const renderDiasCalendario = useMemo(() => {
    const dias = [];
    // Preencher dias vazios antes do 1º dia do mês
    for (let i = 0; i < primeiroDiaDoMes; i++) {
      dias.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Preencher dias do mês com status de presença
    for (let i = 1; i <= diasNoMes; i++) {
      const dataString = `${String(i).padStart(2, '0')}/${String(mesSelecionado).padStart(2, '0')}/${anoSelecionado}`;
      const registrosDoDia = dadosFiltrados.filter(r => r.data === dataString);
      let statusDia = ''; // 'presente', 'ausente', ou '' (para dias sem aula)

      if (registrosDoDia.length > 0) {
        // Se todas as aulas do dia foram ausentes, o dia é 'ausente'
        if (registrosDoDia.every(r => r.status === 'Ausente')) {
          statusDia = 'ausente';
        } else {
          statusDia = 'presente'; // Se pelo menos uma aula foi presente, o dia é 'presente'
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
  }, [mesSelecionado, anoSelecionado, dadosFiltrados, diasNoMes, primeiroDiaDoMes]);


  // Mapeamento de números do mês para nomes
  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

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

      {dadosFiltrados.length === 0 && (
        <div className="alert alert-info text-center mt-3">
          Nenhum dado de presença encontrado para {nomesMeses[mesSelecionado - 1]} de {anoSelecionado}.
        </div>
      )}

      {dadosFiltrados.length > 0 && (
        <>
          {/* Gráficos */}
          <div className="row mb-5">
            <div className="col-md-6 mb-4 mb-md-0">
              <h6 className="label-azul mb-3 text-center">Presença por Aula (Mês Atual)</h6>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dadosGraficoBarras}>
                  <CartesianGrid strokeDasharray="3 3" />
                  
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
                    labelLine={false}
                  >
                    {dadosGraficoPizza.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={coresPizza[index % coresPizza.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
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
                  {dadosFiltrados.map((registro) => (
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