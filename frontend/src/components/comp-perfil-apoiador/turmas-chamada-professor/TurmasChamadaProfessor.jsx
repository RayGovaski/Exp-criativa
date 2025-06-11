import React, { useState } from 'react';
import { Card, Table, Button, Form, Alert, Modal } from 'react-bootstrap';
import { FaEdit, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa'; // Ícones
import './TurmasChamadaProfessor.css';

// Dados mockados de turmas e alunos para cada turma
const turmasMock = [
  {
    id: 1,
    nome: 'Turma A - 3º Ano Fundamental',
    materia: 'Matemática',
    horario: 'Seg/Qua 08:00 - 10:00',
    sala: 'Sala 101',
    alunos: [
      { id: 101, nome: 'Lucas Pires', presente: false },
      { id: 102, nome: 'Sofia Almeida', presente: false },
      { id: 103, nome: 'Miguel Costa', presente: false },
    ],
  },
  {
    id: 2,
    nome: 'Turma B - 5º Ano Fundamental',
    materia: 'Português',
    horario: 'Ter/Qui 14:00 - 16:00',
    sala: 'Sala 203',
    alunos: [
      { id: 201, nome: 'Isabela Santos', presente: false },
      { id: 202, nome: 'Gabriel Rocha', presente: false },
    ],
  },
];

const TurmasChamadaProfessor = () => {
  // eslint-disable-next-line no-unused-vars
  const [turmas, setTurmas] = useState(turmasMock);
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [dataChamada, setDataChamada] = useState('');
  const [showChamadaModal, setShowChamadaModal] = useState(false);
  const [chamadaFeita, setChamadaFeita] = useState(false); // Para indicar se a chamada foi salva

  const handleAbrirChamadaModal = (turma) => {
    setTurmaSelecionada(turma);
    setDataChamada(new Date().toISOString().split('T')[0]); // Data atual como padrão
    setShowChamadaModal(true);
    setChamadaFeita(false); // Reseta o status da chamada
  };

  const handleFecharChamadaModal = () => {
    setShowChamadaModal(false);
    setTurmaSelecionada(null);
    // Opcional: reiniciar o estado 'presente' dos alunos da turma
    // setTurmas(turmas.map(t => t.id === turmaSelecionada.id ? { ...t, alunos: t.alunos.map(a => ({...a, presente: false})) } : t));
  };

  const handleTogglePresenca = (alunoId) => {
    if (turmaSelecionada) {
      setTurmaSelecionada(prevTurma => ({
        ...prevTurma,
        alunos: prevTurma.alunos.map(aluno =>
          aluno.id === alunoId ? { ...aluno, presente: !aluno.presente } : aluno
        ),
      }));
    }
  };

  const handleSalvarChamada = () => {
    if (turmaSelecionada) {
      console.log(`Chamada da Turma: ${turmaSelecionada.nome}, Data: ${dataChamada}`);
      turmaSelecionada.alunos.forEach(aluno => {
        console.log(`- Aluno: ${aluno.nome}, Presença: ${aluno.presente ? 'Presente' : 'Ausente'}`);
      });
      alert(`Chamada da turma ${turmaSelecionada.nome} para ${dataChamada} salva (simulado)!`);
      setChamadaFeita(true); // Indica que a chamada foi salva
      // Normalmente, aqui você enviaria os dados para o backend
      // await axios.post('/api/salvar-chamada', { turmaId: turmaSelecionada.id, data: dataChamada, presencas: turmaSelecionada.alunos });
      handleFecharChamadaModal(); // Fecha o modal após salvar
    }
  };

  return (
    <>
      <Card className="mb-4 shadow-sm p-4">
        <h4 className="label-azul mb-4">Minhas Turmas e Chamada</h4>

        {turmas.length > 0 ? (
          <div className="row">
            {turmas.map((turma) => (
              <div key={turma.id} className="col-md-6 mb-4">
                <Card className="h-100 turma-card">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="label-azul mb-2 popopo">{turma.nome}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Matéria: {turma.materia}</Card.Subtitle>
                    <Card.Text>
                      <strong>Horário:</strong> {turma.horario}
                      <br />
                      <strong>Sala:</strong> {turma.sala}
                      <br />
                      <strong>Alunos:</strong> {turma.alunos.length}
                    </Card.Text>
                    <Button
                      className="custom-button-azul6 mt-3" // Reutilizando estilo de botão
                      onClick={() => handleAbrirChamadaModal(turma)}
                    >
                      <FaCalendarAlt className="me-2" /> Fazer Chamada
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-center mt-3">Nenhuma turma atribuída no momento.</p>
        )}
      </Card>

      {/* Modal de Chamada */}
      <Modal show={showChamadaModal} onHide={handleFecharChamadaModal} centered className="modal-chamada">
        <div className="registro-header-azul">
          <Modal.Title className="text-white">Fazer Chamada - {turmaSelecionada?.nome}</Modal.Title>
        </div>
        <Modal.Body className="py-4">
          <Form.Group className="mb-4">
            <Form.Label className="label-azul fw-bold">Data da Chamada:</Form.Label>
            <Form.Control
              type="date"
              value={dataChamada}
              onChange={(e) => setDataChamada(e.target.value)}
              readOnly={chamadaFeita} // Desabilita edição da data após salvar
            />
          </Form.Group>

          <h5 className="label-azul mb-3">Alunos:</h5>
          {turmaSelecionada?.alunos.length > 0 ? (
            <Table striped bordered hover className="chamada-table">
              <thead>
                <tr>
                  <th>Nome do Aluno</th>
                  <th className="text-center">Presença</th>
                </tr>
              </thead>
              <tbody>
                {turmaSelecionada.alunos.map((aluno) => (
                  <tr key={aluno.id}>
                    <td>{aluno.nome}</td>
                    <td className="text-center">
                      <Button
                        variant={aluno.presente ? "success" : "danger"}
                        onClick={() => handleTogglePresenca(aluno.id)}
                        disabled={chamadaFeita} // Desabilita toggle após salvar
                        className="btn-presenca-toggle"
                      >
                        {aluno.presente ? <FaCheckCircle /> : <FaTimesCircle />}
                        {aluno.presente ? ' Presente' : ' Ausente'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted text-center">Nenhum aluno nesta turma.</p>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
          <Button
            variant="outline-secondary"
            onClick={handleFecharChamadaModal}
            className="custom-button-outline px-4"
          >
            {chamadaFeita ? 'Fechar' : 'Cancelar'}
          </Button>
          {!chamadaFeita && ( // Esconde o botão de salvar após a chamada ser feita
            <Button
              className="custom-button-azul6 px-4"
              onClick={handleSalvarChamada}
              disabled={!dataChamada} // Desabilita se a data não estiver preenchida
            >
              Salvar Chamada
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TurmasChamadaProfessor;