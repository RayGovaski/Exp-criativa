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
                // A rota para buscar a lista de doações
                const response = await axios.get('http://localhost:8000/doacoes/todas');
                console.log("DADOS BRUTOS RECEBIDOS DA API:", response.data); 
                
                const formattedDoacoes = response.data.map(doacao => {
                    const porcentagem = doacao.porcentagem || 0;
                    let corTopoClass = 'cor-rosa-claro'; // Cor padrão
                    let tipoBotaoClass = 'botao-rosa-claro';
                    
                    if (doacao.status === 'Concluída' || porcentagem >= 100) {
                        tipoBotaoClass += ' disabled';
                    }

                    // ✅ LÓGICA CORRIGIDA ✅
                    // Verifica o campo 'tem_imagem' que o backend agora envia
                    const imageUrl = doacao.tem_imagem ? `http://localhost:8000/doacoes/imagem/${doacao.id}` : null;

                    return {
                        ...doacao, // Mantém todos os outros dados
                        imagem: imageUrl // Define a URL da imagem corretamente
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

    // ... (o resto do seu componente: if loading, if error, etc.)
    if (loading) return <Container className="text-center my-4"><p>Carregando...</p></Container>;
    if (error) return <Container className="text-center my-4"><p className="text-danger">{error}</p></Container>;

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
                    <Col key={item.id} md={6} lg={4} className="d-flex align-items-stretch">
                        <Card className="sombra-card2 card-largo h-100 position-relative">
                            <div className={`card-top-bar ${item.corTopo || 'cor-rosa-claro'}`}></div>
                            <Card.Img 
                                variant="top" 
                                src={item.imagem || "https://placehold.co/600x400?text=Sem+Imagem"} 
                                className="img-doacao" 
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400?text=Erro"; }}
                            />
                            <Card.Body className="d-flex flex-column">
                                <div>
                                    <Card.Title>{item.titulo}</Card.Title>
                                    <Card.Text>{item.descricao}</Card.Text>
                                </div>
                                <div className="mt-auto">
                                    <ProgressBar now={item.porcentagem} label={`${item.porcentagem}%`} className="mb-3" />
                                    <Link
                                        to="/doar-pagamento"
                                        state={{ preSelectedCauseId: item.id, preSelectedCauseTitle: item.titulo }}
                                        className={`btn ${item.tipoBotao || 'botao-rosa-claro'}`}
                                    >
                                        Doar
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default PaginaDoacoes;