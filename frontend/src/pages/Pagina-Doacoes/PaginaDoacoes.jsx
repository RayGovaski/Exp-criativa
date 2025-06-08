// src/pages/DoacoesPage/PaginaDoacoes.jsx
import React from 'react';
import { Container, Row, Col, ProgressBar, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import '../../components/comp_home/Doacoes.css';

const doacoesMock = [
    {
        id: 'violao',
        titulo: 'Ajude a comprar um violão',
        descricao: 'Ajude a comprar um violão para que mais crianças aprendam a tocar e se apaixonem pela música!',
        imagem: 'src/Assets/Card1.png',
        porcentagem: 55,
        corTopo: 'cor-rosa',
        tipoBotao: 'botao-rosa-escuro'
    },
    {
        id: 'roupas_acessorios',
        titulo: 'Roupas e acessórios',
        descricao: 'Contribua para a compra de roupas e acessórios que deixam os espetáculos ainda mais mágicos!',
        imagem: 'src/Assets/Card2.png',
        porcentagem: 80,
        corTopo: 'cor-rosa-claro',
        tipoBotao: 'botao-rosa-claro'
    },
    {
        id: 'materiais_criativos',
        titulo: 'Materiais criativos',
        descricao: 'Com sua doação, podemos garantir que as crianças soltem a criatividade com materiais de qualidade!',
        imagem: 'src/Assets/Card3.png',
        porcentagem: 95,
        corTopo: 'cor-rosa',
        tipoBotao: 'botao-rosa-escuro'
    },
    {
        id: 'microfones_aulas',
        titulo: 'Microfones para aulas',
        descricao: 'Ajude a garantir que as crianças tenham equipamentos para se expressar nas aulas de canto e teatro.',
        imagem: 'src/Assets/Card4.png',
        porcentagem: 55,
        corTopo: 'cor-rosa-claro',
        tipoBotao: 'botao-rosa-claro'
    }
];

const PaginaDoacoes = () => {
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
                {doacoesMock.map((item) => (
                    <Col key={item.id} md={5} lg={3}>
                        <Card className="sombra-card2 card-largo h-100 position-relative">
                            <div className={`card-top-bar ${item.corTopo}`}></div>
                            <Card.Img variant="top" src={item.imagem} className="img-doacao" />
                            <Card.Body className="d-flex flex-column">
                                <div>
                                    <Card.Title>{item.titulo}</Card.Title>
                                    <Card.Text>{item.descricao}</Card.Text>
                                </div>
                                <ProgressBar now={item.porcentagem} label={`${item.porcentagem}%`} className="mb-3 mt-auto" />
                                <Link
                                    to="/doarr"
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