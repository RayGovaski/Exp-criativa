import React from 'react';
import { Card, Table } from 'react-bootstrap'; // Removido ListGroup, pois usaremos apenas Table
import './SalaAluno.css';

// Dados simulados das aulas em que o aluno está inscrito
const aulasInscritasMock = [
  { 
    id: 1, 
    dia: 'Segunda-feira', 
    nomeSala: 'Sala Alpha', 
    professor: 'Prof. Ana Silva', 
    horario: '08:00 - 09:30', 
    atividade: 'Matemática Avançada' 
  },
  { 
    id: 2, 
    dia: 'Segunda-feira', 
    nomeSala: 'Estúdio de Arte', 
    professor: 'Prof. Marcos Lima', 
    horario: '10:00 - 11:30', 
    atividade: 'Expressão Artística' 
  },
  { 
    id: 3, 
    dia: 'Quarta-feira', 
    nomeSala: 'Sala Beta', 
    professor: 'Prof. Carla Fernandes', 
    horario: '14:00 - 15:30', 
    atividade: 'Português Criativo' 
  },
  { 
    id: 4, 
    dia: 'Quinta-feira', 
    nomeSala: 'Teatro Principal', 
    professor: 'Prof. Roberto Santos', 
    horario: '09:00 - 10:30', 
    atividade: 'Oficina de Teatro' 
  },
  { 
    id: 5, 
    dia: 'Sexta-feira', 
    nomeSala: 'Laboratório de Ciências', 
    professor: 'Prof. Pedro Costa', 
    horario: '13:00 - 14:30', 
    atividade: 'Experimentos em Ciências' 
  },
];

const SalaAluno = () => {
  return (
    <Card className="mb-4 shadow-sm p-4">
      <h4 className="label-azul mb-4">Minhas Aulas Inscritas</h4>

      {aulasInscritasMock.length > 0 ? (
        <Table striped bordered hover responsive className="aulas-table">
          <thead>
            <tr>
              <th>Dia</th>
              <th>Horário</th>
              <th>Sala</th>
              <th>Atividade</th>
              <th>Professor(a)</th>
            </tr>
          </thead>
          <tbody>
            {aulasInscritasMock.map((aula) => (
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