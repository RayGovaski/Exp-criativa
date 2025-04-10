import React from 'react';
import { ProgressBar, Button, Card, Row, Col, Container } from 'react-bootstrap';
import "./Doacoes.css";

const doacoesMock = [
  {
    id: 1,
    titulo: 'Ajude a comprar um violão',
    descricao: 'Ajude a comprar um violão para que mais crianças aprendam a tocar e se apaixonem pela música!',
    imagem: 'src/Assets/Card1.png',
    porcentagem: 55,
    corTopo: 'cor-rosa',
    tipoBotao: 'botao-rosa-escuro'
  },
  {
    id: 2,
    titulo: 'Roupas e acessórios',
    descricao: 'Contribua para a compra de roupas e acessórios que deixam os espetáculos ainda mais mágicos!',
    imagem: 'src/Assets/Card2.png',
    porcentagem: 80,
    corTopo: 'cor-rosa-claro',
    tipoBotao: 'botao-rosa-claro'
  },
  {
    id: 3,
    titulo: 'Materiais criativos',
    descricao: 'Com sua doação, podemos garantir que as crianças soltem a criatividade com materiais de qualidade!',
    imagem: 'src/Assets/Card3.png',
    porcentagem: 95,
    corTopo: 'cor-rosa',
    tipoBotao: 'botao-rosa-escuro'
  },
  {
    id: 4,
    titulo: 'Microfones para aulas',
    descricao: 'Ajude a garantir que as crianças tenham equipamentos para se expressar nas aulas de canto e teatro.',
    imagem: 'src/Assets/Card4.png',
    porcentagem: 55,
    corTopo: 'cor-rosa-claro',
    tipoBotao: 'botao-rosa-claro'
  }
];

const Doacoes = ({ doacoes = doacoesMock }) => {
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
              <Card.Img variant="top" src={item.imagem} className="img-doacao" />
              <Card.Body className="d-flex flex-column">
                <div>
                  <Card.Title>{item.titulo}</Card.Title>
                  <Card.Text>{item.descricao}</Card.Text>
                </div>
                <ProgressBar now={item.porcentagem} label={`${item.porcentagem}%`} className="mb-3 mt-auto" />
                <Button className={item.tipoBotao}>Doar</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Botão grande abaixo dos cards */}
      <div className="btn-saber-mais-container">
        <Button className="botao-rosa-escuro btn-saber-mais">Saber mais</Button>
      </div>
    </Container>
  );
};

export default Doacoes;
