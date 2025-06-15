import React, { useState, useEffect } from 'react'; // Adicione useState, useEffect
import { Card, Spinner, Alert } from 'react-bootstrap'; // Adicione Spinner, Alert
import axios from 'axios'; // Para chamadas de API
import { useAuth } from '../../../context/AuthContext'; // Para obter token e user
import './RelatoriosADM.css'; // Importa o CSS para este componente

const RelatoriosADM = () => {
  const { user, token, isAuthenticated } = useAuth(); // Obtenha user, token, isAuthenticated
  const [stats, setStats] = useState(null); // Estado para armazenar as estatísticas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efeito para buscar as estatísticas do dashboard
  useEffect(() => {
    const fetchAdminStats = async () => {
      // Proteção no frontend para que só administradores busquem esses dados
      if (!isAuthenticated() || !user || user.role !== 'administrador') {
        setError("Acesso negado. Esta seção é exclusiva para administradores.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8000/administrador/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data); // Define as estatísticas
      } catch (err) {
        console.error("Erro ao buscar estatísticas do administrador:", err.response || err);
        setError("Falha ao carregar relatórios administrativos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [user, token, isAuthenticated]); // Depende do user, token e isAuthenticated

  if (loading) {
    return (
      <Card className="mb-4 shadow-sm p-4 text-center">
        <Spinner animation="border" role="status" className="mb-3" />
        <p>Carregando relatórios administrativos...</p>
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

  const dataAtual = new Date();
  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const mesAtualNome = nomesMeses[dataAtual.getMonth()];

  return (
    <Card className="mb-4 shadow-sm p-4">
      <h4 className="label-azul mb-4">Relatórios Administrativos</h4>
      <p>Aqui você pode visualizar relatórios e estatísticas gerais do sistema.</p>
      <div className="placeholder-content">
        <h5>Visão Geral</h5>
        <p>Número total de alunos: <strong>{stats?.totalAlunos ?? 'N/A'}</strong></p>
        <p>Número total de professores: <strong>{stats?.totalProfessores ?? 'N/A'}</strong></p>
        <p>Total doado em {mesAtualNome}: <strong>R$ {stats?.totalDoadoMes?.toFixed(2).replace('.', ',') ?? '0,00'}</strong></p>
        <p>Turmas ativas: <strong>{stats?.totalTurmasAtivas ?? 'N/A'}</strong></p>
        {/* Você pode adicionar gráficos, tabelas e mais dados aqui, usando as classes do CSS */}
      </div>
    </Card>
  );
};

export default RelatoriosADM;