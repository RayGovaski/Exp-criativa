import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap'; // Adicionado Modal e Button
import './MateriasAluno.css';

// Dados simulados das matérias que o aluno PODE se inscrever
const materiasDisponiveis = [
  { 
    id: 1, 
    nome: 'Matemática Aplicada', 
    professor: 'Prof. Ana Silva', 
    descricao: 'Fundamentos de matemática para o dia a dia e resolução de problemas.', 
    dataInicio: '15/07/2025', 
    horario: 'Seg/Qua 08:00 - 09:30',
    sala: 'Sala 101'
  },
  { 
    id: 2, 
    nome: 'Português: Escrita Criativa', 
    professor: 'Prof. João Santos', 
    descricao: 'Desenvolva suas habilidades de escrita e conte histórias incríveis.', 
    dataInicio: '20/07/2025', 
    horario: 'Ter/Qui 14:00 - 15:30',
    sala: 'Sala 203'
  },
  { 
    id: 3, 
    nome: 'História do Brasil: Período Colonial', 
    professor: 'Prof. Carla Lima', 
    descricao: 'Viagem no tempo para entender as origens do nosso país.', 
    dataInicio: '01/08/2025', 
    horario: 'Seg/Qua 10:00 - 11:30',
    sala: 'Sala 105'
  },
  { 
    id: 4, 
    nome: 'Ciências: O Corpo Humano', 
    professor: 'Prof. Pedro Costa', 
    descricao: 'Descubra como o nosso corpo funciona de forma divertida.', 
    dataInicio: '10/08/2025', 
    horario: 'Ter/Qui 09:00 - 10:30',
    sala: 'Laboratório A'
  },
];

const MateriasAluno = () => {
  const [showModal, setShowModal] = useState(false);
  const [materiaSelecionada, setMateriaSelecionada] = useState(null);
  const [confirmacaoTermos, setConfirmacaoTermos] = useState(false);

  const handleAbrirModal = (materia) => {
    setMateriaSelecionada(materia);
    setConfirmacaoTermos(false); // Reseta a confirmação ao abrir
    setShowModal(true);
  };

  const handleFecharModal = () => {
    setShowModal(false);
    setMateriaSelecionada(null);
  };

  const handleConfirmarInscricao = () => {
    if (materiaSelecionada && confirmacaoTermos) {
      console.log(`Aluno inscrito na matéria: ${materiaSelecionada.nome}`);
      // Aqui você adicionaria a lógica real para enviar a inscrição para o backend
      alert(`Você se inscreveu na matéria: ${materiaSelecionada.nome}!`);
      handleFecharModal(); // Fecha o modal após a inscrição
    } else {
      alert("Por favor, confirme que leu e aceita os termos para se inscrever.");
    }
  };

  return (
    <>
      <Card className="mb-4 shadow-sm p-4">
        <h4 className="label-azul mb-4">Matérias Disponíveis para Inscrição</h4>
        <div className="row">
          {materiasDisponiveis.length > 0 ? (
            materiasDisponiveis.map((materia) => (
              <div key={materia.id} className="col-md-6 mb-4">
                <Card className="h-100 materia-card">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="label-azul mb-2 ml-0 pipipi">{materia.nome}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Professor: {materia.professor}</Card.Subtitle>
                    <Card.Text className="flex-grow-1">
                      {materia.descricao}
                      <br />
                      <strong>Data Início:</strong> {materia.dataInicio}
                      <br />
                      <strong>Horário:</strong> {materia.horario}
                      <br />
                      <strong>Sala:</strong> {materia.sala}
                    </Card.Text>
                    <Button 
                      className="custom-button-azul6 mt-3" // Reutilizando o estilo do botão azul
                      onClick={() => handleAbrirModal(materia)}
                    >
                      Inscrever-se
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <p className="text-muted text-center w-100 mt-3">Nenhuma matéria disponível para inscrição no momento.</p>
          )}
        </div>
      </Card>

      {/* Modal de Confirmação de Inscrição */}
      <Modal 
        show={showModal} 
        onHide={handleFecharModal} 
        centered 
        className="modal-inscricao" // Classe para estilização específica do modal
      >
        <div className="registro-header-azul"> {/* Reutilizando o cabeçalho azul */}
          <Modal.Title className="text-white">Confirmar Inscrição</Modal.Title>
        </div>
        <Modal.Body className="py-4 ">
          {materiaSelecionada && (
            <>
              <p className="mb-3">
                Você está prestes a se inscrever na seguinte matéria:
              </p>
              <h5 className="label-azul mb-3 pipipi">{materiaSelecionada.nome}</h5>
              <p>
                <strong>Professor:</strong> {materiaSelecionada.professor}<br/>
                <strong>Início:</strong> {materiaSelecionada.dataInicio}<br/>
                <strong>Horário:</strong> {materiaSelecionada.horario}<br/>
                <strong>Local:</strong> {materiaSelecionada.sala}
              </p>
              <p className="mt-4 text-muted">
                Ao confirmar, você será oficialmente matriculado(a) nesta turma. Certifique-se de que o horário e a matéria se encaixam na sua agenda.
              </p>
              <div className="form-check mt-3">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="confirmarTermos" 
                  checked={confirmacaoTermos}
                  onChange={(e) => setConfirmacaoTermos(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="confirmarTermos">
                  Li e aceito os termos de inscrição para esta matéria.
                </label>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
          <Button 
            variant="outline-secondary" 
            onClick={handleFecharModal} 
            className="custom-button-outline px-4" // Reutilizando estilo outline
          >
            Cancelar
          </Button>
          <Button 
            className="custom-button-azul6 px-4" // Reutilizando estilo do botão azul
            onClick={handleConfirmarInscricao}
            disabled={!confirmacaoTermos} // Desabilita se os termos não foram aceitos
          >
            Confirmar Inscrição
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MateriasAluno;