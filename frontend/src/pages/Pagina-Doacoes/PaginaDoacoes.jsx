// src/pages/DoacoesPage/PaginaDoacoes.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ProgressBar, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../../components/comp_home/Doacoes.css';

const PaginaDoacoes = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllDoacoes = async () => {
            try {
                // <--- Mude a URL da API aqui para '/doacoes/doar'
                const response = await axios.get('http://localhost:8000/doacoes/doar'); 
                const formattedDoacoes = response.data.map(doacao => {
                    const porcentagem = doacao.porcentagem || 0;
                    let corTopoClass = '';
                    let tipoBotaoClass = '';


                        corTopoClass = 'cor-rosa-claro';
                        tipoBotaoClass = 'botao-rosa-claro';
                    
                    if (doacao.status === 'Concluída' || porcentagem >= 100) {
                        tipoBotaoClass += ' disabled';
                    }

                    const imageUrl = doacao.imagem_path ? `http://localhost:8000/doacoes/imagem/${doacao.id}` : null;

                    return {
                        id: doacao.id,
                        titulo: doacao.titulo,
                        descricao: doacao.descricao,
                        imagem: imageUrl,
                        porcentagem: porcentagem,
                        corTopo: corTopoClass, 
                        tipoBotao: tipoBotaoClass, 
                        valorMeta: doacao.valorMeta,
                        arrecadado: doacao.arrecadado,
                        status: doacao.status,
                        prioridade: doacao.prioridade
                    };
                });
                setDoacoes(formattedDoacoes);
            } catch (err) {
                console.error("Erro ao buscar todas as doações:", err);
                setError("Não foi possível carregar as doações. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllDoacoes();
    }, []);

    if (loading) {
        return (
            <Container className="text-center my-4">
                <p>Carregando todas as doações...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center my-4">
                <p className="text-danger">{error}</p>
            </Container>
        );
    }

    if (doacoes.length === 0) {
        return (
            <Container className="text-center my-4">
                <p>Nenhuma doação disponível no momento que atenda aos critérios.</p>
            </Container>
        );
    }

    return (
        <Container className="doacoes-page-container my-5">
            <Row className="justify-content-center text-center mb-5">
                <Col md={8}>
                    <h1 className="fw-semibold text-danger mb-2">Apoie Nossas Causas</h1>
                    <div className="footer-line2 mx-auto mb-3"></div>
                    <p className="lead fw-semibold text-muted">
                        Cada doação faz a diferença na vida de crianças e jovens,
                        proporcionando acesso à arte, educação e cultura. Escolha uma iniciativa abaixo e contribua!
                    </p>
                </Col>
            </Row>

            <Row className="g-4 justify-content-center">
                {doacoes.map((item) => (
                    <Col key={item.id} md={5} lg={3}>
                        <Card className="sombra-card2 card-largo h-100 position-relative">
                            <div className={`card-top-bar ${item.corTopo}`}></div>
                            <Card.Img 
                                variant="top" 
                                src={item.imagem || "https://placehold.co/150x150?text=Sem+Imagem"} 
                                className="img-doacao" 
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x150?text=Erro+Imagem"; }}
                            />
                            <Card.Body className="d-flex flex-column">
                                <div>
                                    <Card.Title>{item.titulo}</Card.Title>
                                    <Card.Text>{item.descricao}</Card.Text>
                                </div>
                                <ProgressBar now={item.porcentagem} label={`${item.porcentagem}%`} className="mb-3 mt-auto" />
                                <Link
                                    to="/doar-pagamento"
                                    state={{ preSelectedCauseId: item.id, preSelectedCauseTitle: item.titulo }}
                                    className={`btn ${item.tipoBotao}`}
                                >
                                    Doar
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="justify-content-center mt-5">
                <Col xs={12} className="text-center">
                </Col>
            </Row>
        </Container>
    );
};

export default PaginaDoacoes;