import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import './MateriasAluno.css';

const MateriasAluno = () => {
    const { user, token } = useAuth();
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [materiaSelecionada, setMateriaSelecionada] = useState(null);
    const [confirmacaoTermos, setConfirmacaoTermos] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // A função para buscar matérias foi separada para ser reutilizável
    const fetchMaterias = async () => {
        if (!user || !token) {
            setError("Sessão expirada. Faça login novamente.");
            setLoading(false);
            return;
        }

        // Não precisa setar loading aqui se for chamado de dentro de outra função
        // setLoading(true); 
        setError(null);
        try {
            const response = await axios.get('http://localhost:8000/aluno/turmas-disponiveis', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMaterias(response.data);
        } catch (err) {
            console.error("Erro ao buscar matérias disponíveis:", err);
            setError("Falha ao carregar matérias. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    // useEffect agora só roda na montagem ou quando o usuário muda
    useEffect(() => {
        setLoading(true);
        fetchMaterias();
    }, [user, token]);

    const handleAbrirModal = (materia) => {
        setMateriaSelecionada(materia);
        setConfirmacaoTermos(false);
        setShowModal(true);
    };

    const handleFecharModal = () => {
        setShowModal(false);
        setMateriaSelecionada(null);
    };

    const handleConfirmarInscricao = async () => {
        if (!materiaSelecionada || !confirmacaoTermos) {
            alert("Por favor, confirme que leu e aceita os termos para se inscrever.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:8000/aluno/inscrever-turma', 
                { turmaId: materiaSelecionada.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message);
            handleFecharModal();
            fetchMaterias(); // Recarrega a lista após o sucesso
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Falha na inscrição. Tente novamente.";
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDesinscrever = async (materia) => {
        if (!window.confirm(`Tem certeza que deseja se desinscrever da matéria "${materia.nome}"?`)) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:8000/aluno/desinscrever-turma',
                { turmaId: materia.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message);
            fetchMaterias(); // Recarrega a lista após o sucesso
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Falha ao desinscrever-se. Tente novamente.";
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <Card className="mb-4 shadow-sm p-4 text-center"><Spinner animation="border" /><p className="mt-2">Carregando...</p></Card>;
    }

    if (error) {
        return <Card className="mb-4 shadow-sm p-4"><Alert variant="danger">{error}</Alert></Card>;
    }

    return (
        <>
            <Card className="mb-4 shadow-sm p-4">
                <h4 className="label-azul mb-4">Matérias Disponíveis para Inscrição</h4>
                <div className="row">
                    {materias.length > 0 ? (
                        materias.map((materia) => {
                            const vagasRestantes = materia.capacidade - materia.inscritos_count;

                            return ( // ✅ O 'return' que estava faltando
                                <div key={materia.id} className="col-md-6 mb-4">
                                    <Card className="h-100 materia-card">
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="label-azul mb-2 ml-0 pipipi">{materia.nome}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">Professor: {materia.professor_nome || 'Não Atribuído'}</Card.Subtitle>
                                            <Card.Text className="flex-grow-1">
                                                {materia.descricao}
                                                <br />
                                                <strong>Data Início:</strong> {materia.dataInicio ? new Date(materia.dataInicio).toLocaleDateString('pt-BR') : 'N/A'}
                                                <br />
                                                <strong>Horário:</strong> {materia.diaDaSemana} {materia.horaInicio} - {materia.horaTermino}
                                                <br />
                                                <strong>Sala:</strong> {materia.sala}
                                                <br />
                                                <strong>Nível:</strong> {materia.nivel}
                                                <br />
                                                <strong>Vagas restantes:</strong> {vagasRestantes > 0 ? vagasRestantes : <span className="text-danger fw-bold">Lotado</span>}
                                            </Card.Text>
                                            
                                            {materia.inscrito ? (
                                                <Button className="custom-button-vermelho mt-3" onClick={() => handleDesinscrever(materia)} disabled={isSubmitting}>
                                                    {isSubmitting ? 'Aguarde...' : 'Desinscrever-se'}
                                                </Button>
                                            ) : (
                                                <Button 
                                                    className="custom-button-azul6 mt-3"
                                                    onClick={() => handleAbrirModal(materia)}
                                                    disabled={isSubmitting || vagasRestantes <= 0}
                                                >
                                                    {vagasRestantes > 0 ? 'Inscrever-se' : 'Turma Lotada'}
                                                </Button>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-muted text-center w-100 mt-3">Nenhuma matéria disponível para inscrição no momento.</p>
                    )}
                </div>
            </Card>

            <Modal show={showModal} onHide={handleFecharModal} centered className="modal-inscricao">
                <div className="registro-header-azul">
                    <Modal.Title className="text-white">Confirmar Inscrição</Modal.Title>
                </div>
                <Modal.Body className="py-4">
                    {materiaSelecionada && (
                        <>
                            <p className="mb-3">Você está prestes a se inscrever na seguinte matéria:</p>
                            <h5 className="label-azul mb-3 pipipi">{materiaSelecionada.nome}</h5>
                            <p>
                                <strong>Professor:</strong> {materiaSelecionada.professor_nome || 'Não Atribuído'}<br/>
                                <strong>Início:</strong> {materiaSelecionada.dataInicio ? new Date(materiaSelecionada.dataInicio).toLocaleDateString('pt-BR') : 'N/A'}<br/>
                                <strong>Horário:</strong> {materiaSelecionada.diaDaSemana} {materiaSelecionada.horaInicio} - {materiaSelecionada.horaTermino}<br/>
                                <strong>Local:</strong> {materiaSelecionada.sala}<br/>
                                <strong>Nível:</strong> {materiaSelecionada.nivel}<br/>
                                <strong>Vagas Totais:</strong> {materiaSelecionada.capacidade}
                            </p>
                            <p className="mt-4 text-muted">Ao confirmar, você será oficialmente matriculado(a) nesta turma.</p>
                            <div className="form-check mt-3">
                                <input className="form-check-input" type="checkbox" id="confirmarTermos" checked={confirmacaoTermos} onChange={(e) => setConfirmacaoTermos(e.target.checked)} />
                                <label className="form-check-label" htmlFor="confirmarTermos">Li e aceito os termos de inscrição.</label>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
                    <Button variant="outline-secondary" onClick={handleFecharModal} className="custom-button-outline px-4">Cancelar</Button>
                    <Button className="custom-button-azul6 px-4" onClick={handleConfirmarInscricao} disabled={!confirmacaoTermos || isSubmitting}>
                        {isSubmitting ? 'Confirmando...' : 'Confirmar Inscrição'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MateriasAluno;