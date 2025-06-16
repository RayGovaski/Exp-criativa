import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Button, Form, Alert, Modal, Spinner } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import './TurmasChamadaProfessor.css';

const TurmasChamadaProfessor = () => {
    const { token } = useAuth();
    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState(null);
    const [alunosDaTurma, setAlunosDaTurma] = useState([]);
    const [dataChamada, setDataChamada] = useState('');
    const [showChamadaModal, setShowChamadaModal] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        const fetchTurmas = async () => {
            if (!token) return;
            try {
                const response = await axios.get('http://localhost:8000/professores/minhas-turmas', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTurmas(response.data);
            } catch (err) {
                setError("Falha ao carregar suas turmas.");
            } finally {
                setLoading(false);
            }
        };
        fetchTurmas();
    }, [token]);

    const fetchChamadaByDate = useCallback(async (turmaId, date) => {
        setModalLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/professores/chamada-por-data`, {
                params: { turmaId: turmaId, data: date },
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlunosDaTurma(response.data);
        } catch (err) {
            console.error("Erro ao carregar chamada para a data selecionada:", err);
            alert("Erro ao carregar chamada para esta data. Tentando carregar alunos da turma...");
            await fetchAlunosDaTurma(turmaId);
        } finally {
            setModalLoading(false);
        }
    }, [token]);

    const fetchAlunosDaTurma = useCallback(async (turmaId) => {
        setModalLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/professores/turmas/${turmaId}/alunos`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const alunosComPresenca = response.data.map(aluno => ({ ...aluno, presente: true }));
            setAlunosDaTurma(alunosComPresenca);
        } catch (err) {
            console.error("Erro ao carregar lista de alunos da turma:", err);
            alert("Erro ao carregar lista de alunos.");
            setAlunosDaTurma([]);
        } finally {
            setModalLoading(false);
        }
    }, [token]);

    const handleAbrirChamadaModal = async (turma) => {
        setTurmaSelecionada(turma);
        setShowChamadaModal(true);
        setModalLoading(true); // Start loading state for modal

        const hoje = new Date();
        const dataFormatada = hoje.toISOString().split('T')[0];
        setDataChamada(dataFormatada);

        await fetchChamadaByDate(turma.id, dataFormatada);
    };

    const handleFecharChamadaModal = () => {
        setShowChamadaModal(false);
        setTurmaSelecionada(null);
        setAlunosDaTurma([]);
        setDataChamada('');
    };

    const handleTogglePresenca = (alunoId) => {
        setAlunosDaTurma(prevAlunos =>
            prevAlunos.map(aluno =>
                aluno.id === alunoId ? { ...aluno, presente: !aluno.presente } : aluno
            )
        );
    };

    const handleChangeDataChamada = async (e) => {
        const novaData = e.target.value;
        setDataChamada(novaData);
        if (turmaSelecionada && novaData) {
            await fetchChamadaByDate(turmaSelecionada.id, novaData);
        }
    };

    const handleSalvarChamada = async () => {
        const payload = {
            turmaId: turmaSelecionada.id,
            dataChamada: dataChamada,
            presencas: alunosDaTurma.map(a => ({ alunoId: a.id, presente: a.presente }))
        };

        try {
            const response = await axios.post('http://localhost:8000/professores/chamada', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            handleFecharChamadaModal();
        } catch (err) {
            alert(err.response?.data?.error || "Erro ao salvar chamada.");
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

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
                                        <Card.Text>
                                            <strong>Horário:</strong> {turma.dia_da_semana} {turma.hora_inicio.substring(0, 5)} - {turma.hora_termino.substring(0, 5)}
                                            <br />
                                            <strong>Sala:</strong> {turma.sala}
                                            <br />
                                            <strong>Alunos:</strong> {turma.alunos_count}
                                        </Card.Text>
                                        <Button className="custom-button-azul6 mt-auto" onClick={() => handleAbrirChamadaModal(turma)}>
                                            <FaCalendarAlt className="me-2" /> Fazer Chamada
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted text-center mt-3">Nenhuma turma atribuída a você no momento.</p>
                )}
            </Card>

            <Modal show={showChamadaModal} onHide={handleFecharChamadaModal} size="lg" centered>
                <div className="registro-header-azul"><Modal.Title className="text-white">Fazer Chamada - {turmaSelecionada?.nome}</Modal.Title></div>
                <Modal.Body className="py-4">
                    {modalLoading ? (
                        <div className="text-center"><Spinner animation="border" /></div>
                    ) : (
                        <> {/* This Fragment wraps all sibling elements */}
                            <Form.Group className="mb-4">
                                <Form.Label className="label-azul fw-bold">Data da Chamada:</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dataChamada}
                                    onChange={handleChangeDataChamada}
                                />
                            </Form.Group>
                            <h5 className="label-azul mb-3">Alunos:</h5>
                            {alunosDaTurma.length > 0 ? (
                                <Table striped bordered hover className="chamada-table">
                                    <thead><tr><th>Nome do Aluno</th><th className="text-center">Presença</th></tr></thead>
                                    <tbody>
                                        {alunosDaTurma.map((aluno) => (
                                            <tr key={aluno.id}>
                                                <td>{aluno.nome}</td>
                                                <td className="text-center">
                                                    <Button variant={aluno.presente ? "success" : "danger"} onClick={() => handleTogglePresenca(aluno.id)} className="btn-presenca-toggle">
                                                        {aluno.presente ? <><FaCheckCircle /> Presente</> : <><FaTimesCircle /> Ausente</>}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p className="text-muted text-center">Nenhum aluno nesta turma.</p>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
                    <Button variant="outline-secondary" onClick={handleFecharChamadaModal} className="custom-button-outline px-4">Cancelar</Button>
                    <Button className="custom-button-azul6 px-4" onClick={handleSalvarChamada} disabled={modalLoading || !dataChamada}>Salvar Chamada</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TurmasChamadaProfessor;