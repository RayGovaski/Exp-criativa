import React, { useState, useEffect } from 'react';
import { ProgressBar, Button, Card, Row, Col, Container } from 'react-bootstrap';
import "./Doacoes.css";
import { Link } from "react-router-dom";
import axios from 'axios';

const Doacoes = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoacoes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/doacoes');
                
                const formattedDoacoes = response.data.map(doacao => {
                    const porcentagem = doacao.porcentagem || 0;
                    
                    // ✅ LÓGICA DE IMAGEM CORRIGIDA ✅
                    // Verifica o campo 'tem_imagem' e constrói a URL correta
                    const imageUrl = doacao.tem_imagem 
                        ? `http://localhost:8000/doacoes/imagem/${doacao.id}?t=${new Date().getTime()}` 
                        : null;

                    return {
                        id: doacao.id,
                        titulo: doacao.titulo,
                        descricao: doacao.descricao,
                        imagem: imageUrl, // A URL da imagem é definida aqui
                        porcentagem: porcentagem,
                        corTopo: 'cor-rosa',
                        tipoBotao: (doacao.status === 'Concluída' || porcentagem >= 100) ? 'botao-rosa-claro disabled' : 'botao-rosa-claro'
                    };
                });
                setDoacoes(formattedDoacoes);
            } catch (err) {
                console.error("Erro ao buscar doações:", err);
                setError("Não foi possível carregar as doações. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchDoacoes();
    }, []);

    if (loading) {
        return <Container className="text-center my-4 ajustar-tamanho"><p>Carregando doações...</p></Container>;
    }
    if (error) {
        return <Container className="text-center my-4 ajustar-tamanho"><p className="text-danger">{error}</p></Container>;
    }
    if (doacoes.length === 0) {
        return <Container className="text-center my-4 ajustar-tamanho"><p>Nenhuma doação disponível no momento.</p></Container>;
    }

    return (
        <Container className="text-center my-4 ajustar-tamanho">
            <h2 className="fw-bold text-danger mb-0">Apoie uma Causa</h2>
            <div className="footer-line2"></div>
            <p className="fw-semibold mb-4">Ajude a transformar vidas apoiando uma dessas iniciativas!</p>
            
            <Row className="g-4 justify-content-center">
                {doacoes.map((item) => (
                    <Col key={item.id} md={6} lg={3} className="d-flex align-items-stretch">
                        <Card className="sombra-card2 card-largo h-100 position-relative">
                            <div className={`card-top-bar ${item.corTopo}`}></div>
                            <Card.Img 
                                variant="top" 
                                src={item.imagem || "https://placehold.co/600x400?text=Sem+Imagem"}
                                className="img-doacao" 
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400?text=Erro"; }}
                            />
                            <Card.Body className="d-flex flex-column">
                                <div className="flex-grow-1">
                                    <Card.Title>{item.titulo}</Card.Title>
                                    <Card.Text>{item.descricao}</Card.Text>
                                </div>
                                <div className="mt-auto">
                                    <ProgressBar now={item.porcentagem} label={`${item.porcentagem}%`} className="mb-3" />
                                    {/* ✅ BOTÃO DE DOAÇÃO ADICIONADO ✅ */}
                                    <Link
                                        to="/doar-pagamento"
                                        state={{ preSelectedCauseId: item.id, preSelectedCauseTitle: item.titulo }}
                                        className={`btn ${item.tipoBotao} || 'botao-rosa-claro'}`}
                                    >
                                        Apoiar Causa
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="btn-saber-mais-container">
                <Link to="/doar" className="btn botao-rosa-escuro btn-saber-mais">
                    Veja Mais Onde Você Pode Ajudar!
                </Link>
            </div>
        </Container>
    );
};

export default Doacoes;