import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import './DadosPessoaisProfessor.css';

const DadosPessoaisProfessor = () => {
    const { token } = useAuth();
    const [professorData, setProfessorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect agora só busca os dados do professor uma vez.
    useEffect(() => {
        const fetchProfessorData = async () => {
            if (!token) {
                setLoading(false);
                setError("Sessão inválida. Por favor, faça o login novamente.");
                return;
            }
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8000/professores/perfil', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfessorData(response.data);
            } catch (err) {
                console.error("Erro ao buscar dados do professor:", err);
                setError("Falha ao carregar os dados. Tente recarregar a página.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfessorData();
    }, [token]);

    // Todas as funções de manipulação de imagem e modal foram removidas.

    if (loading) {
        return <div className="text-center p-5"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!professorData) {
        return <Alert variant="info">Nenhum dado de professor encontrado.</Alert>;
    }

    // O JSX agora é apenas para exibição dos dados.
    return (
        <Card className="mb-4 shadow-sm p-4">
            <h4 className="label-azul mb-4">Meus Dados Pessoais</h4>
            
            <Row>
                {/* A coluna da foto foi removida, e esta ocupa o espaço todo */}
                <Col>
                    <Row>
                        <Col md={6}>
                            <div className="mb-3">
                                <h6 className="label-azul">Nome completo</h6>
                                <p className="form-control bg-light">{professorData.nome}</p>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <h6 className="label-azul">Email</h6>
                                <p className="form-control bg-light">{professorData.email}</p>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                             <div className="mb-3">
                                <h6 className="label-azul">CPF</h6>
                                <p className="form-control bg-light">{professorData.cpf}</p>
                            </div>
                        </Col>
                        <Col md={6}>
                             <div className="mb-3">
                                <h6 className="label-azul">Telefone</h6>
                                <p className="form-control bg-light">{professorData.telefone || 'Não informado'}</p>
                            </div>
                        </Col>
                    </Row>
                   
                    <Row>
                         <Col md={6}>
                            <div className="mb-3">
                                <h6 className="label-azul">Data de nascimento</h6>
                                <p className="form-control bg-light">
                                    {professorData.data_nascimento ? new Date(professorData.data_nascimento).toLocaleDateString('pt-BR') : 'Não informado'}
                                </p>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <h6 className="label-azul">Data de Contratação</h6>
                                <p className="form-control bg-light">
                                    {professorData.data_contratacao ? new Date(professorData.data_contratacao).toLocaleDateString('pt-BR') : 'Não informado'}
                                </p>
                            </div>
                        </Col>
                    </Row>

                     {/* Seção de Endereço */}
                     {professorData.logradouro && (
                        <>
                            <hr/>
                            <h5 className="label-azul mt-3 mb-3">Endereço</h5>
                            <Row>
                                <Col md={8}>
                                    <div className="mb-3">
                                        <h6 className="label-azul">Logradouro</h6>
                                        <p className="form-control bg-light">{professorData.logradouro}</p>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-3">
                                        <h6 className="label-azul">Número</h6>
                                        <p className="form-control bg-light">{professorData.numero_residencia}</p>
                                    </div>
                                </Col>
                            </Row>
                             <Row>
                                <Col md={4}>
                                    <div className="mb-3">
                                        <h6 className="label-azul">Bairro</h6>
                                        <p className="form-control bg-light">{professorData.bairro}</p>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-3">
                                        <h6 className="label-azul">Cidade</h6>
                                        <p className="form-control bg-light">{professorData.cidade}</p>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="mb-3">
                                        <h6 className="label-azul">CEP</h6>
                                        <p className="form-control bg-light">{professorData.cep}</p>
                                    </div>
                                </Col>
                            </Row>
                        </>
                     )}
                </Col>
            </Row>
        </Card>
    );
};

export default DadosPessoaisProfessor;