import React, { useState, useEffect } from 'react'; // Importe useState e useEffect
import { Card, Table, Spinner, Alert } from 'react-bootstrap'; // Adicionado Spinner e Alert
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext'; // Importe useAuth
import './SalaAluno.css';

// Remova aulasInscritasMock, pois os dados virão do backend
// const aulasInscritasMock = [...]

const SalaAluno = () => {
  const { user, token } = useAuth(); // Obtenha user e token
  const [aulasInscritas, setAulasInscritas] = useState([]); // Estado para as aulas do backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efeito para buscar as aulas inscritas ao montar o componente
  useEffect(() => {
    const fetchAulasInscritas = async () => {
      if (!user || !token || user.role !== 'aluno') {
        setError("Não autenticado como aluno ou sessão expirada. Faça login novamente.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8000/alunos/minhas-aulas', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAulasInscritas(response.data); // Define os dados recebidos do backend
      } catch (err) {
        console.error("Erro ao buscar aulas inscritas:", err);
        setError("Falha ao carregar suas aulas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchAulasInscritas();
  }, [user, token]); // Depende de user e token

  if (loading) {
    return (
      <Card className="mb-4 shadow-sm p-4 text-center">
        <Spinner animation="border" role="status" className="mb-3" />
        <p>Carregando suas aulas...</p>
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
      <h4 className="label-azul mb-4">Minhas Aulas Inscritas</h4>

      {aulasInscritas.length > 0 ? ( // Usa aulasInscritas do estado
        <Table striped bordered hover responsive className="aulas-table">
          <thead>
            <tr>
              <th>Dia</th>
              <th>Horário</th>
              <th>Sala</th>
              <th>Atividade</th> {/* 'atividade' no frontend é o 'nome' da turma no DB */}
              <th>Professor(a)</th>
            </tr>
          </thead>
          <tbody>
            {aulasInscritas.map((aula) => (
              <tr key={aula.id}>
                <td>{aula.dia}</td>
                <td>{aula.horario}</td>
                <td>{aula.nomeSala}</td>
                <td>{aula.atividade}</td>
                <td>{aula.professor}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-muted text-center mt-3">Você ainda não está inscrito em nenhuma aula.</p>
      )}
    </Card>
  );
};

export default SalaAluno;