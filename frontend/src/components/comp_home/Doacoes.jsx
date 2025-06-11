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
                    
                    // --- DECLARE AS VARIÁVEIS AQUI ---
                    let corTopoClass = ''; // <--- ADICIONE ESTA LINHA
                    let tipoBotaoClass = ''; // <--- ADICIONE ESTA LINHA

                    corTopoClass = 'cor-rosa'; // <--- Nova atribuição fixa

                    // Constrói a URL completa da imagem.
                    const imageUrl = doacao.imagem_path ? `http://localhost:8000/doacoes/imagem/${doacao.id}` : null; 

                    return {
                        id: doacao.id,
                        titulo: doacao.titulo,
                        descricao: doacao.descricao,
                        imagem: imageUrl,
                        porcentagem: porcentagem,
                        corTopo: corTopoClass, // Variável agora definida
                        tipoBotao: tipoBotaoClass, // Variável agora definida
                        valorMeta: doacao.valorMeta,
                        arrecadado: doacao.arrecadado,
                        status: doacao.status,
                        prioridade: doacao.prioridade
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
        return (
            <Container className="text-center my-4 ajustar-tamanho">
                <p>Carregando doações...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center my-4 ajustar-tamanho">
                <p className="text-danger">{error}</p>
            </Container>
        );
    }

    if (doacoes.length === 0) {
        return (
            <Container className="text-center my-4 ajustar-tamanho">
                <p>Nenhuma doação disponível no momento.</p>
            </Container>
        );
    }

    return (
        <Container className="text-center my-4 ajustar-tamanho">
            <h2 className="fw-bold text-danger mb-0">Doar para uma causa</h2>
            <div className="footer-line2"></div>
            <p className="fw-semibold mb-4">Ajude a transformar vidas apoiando uma dessas iniciativas!</p>
            
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
                                
                                
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="btn-saber-mais-container">
                <Link to="/doar" className="btn botao-rosa-escuro btn-saber-mais">
                    Veja Mais Onde Voce Pode Ajudar!
                </Link>
            </div>
        </Container>
    );
};

export default Doacoes;