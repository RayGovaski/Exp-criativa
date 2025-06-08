import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./Contato.css";

const Contato = () => {
  return (
    <div id="contato" className="contato-section">
      <div className="contato-content"> 
      <Container className="contato-container mudarissoaqui">
        <Row>
          <Col md={4} className="social-section">
            <div className="social-item">
              <img src="src\Assets\IconInsta.png" alt="Instagram" className="social-img" /> Instagram
            </div>
            <div className="social-item">
              <img src="src\Assets\IconFace.png" alt="Facebook" className="social-img" /> Facebook
            </div>
            <div className="social-item">
              <img src="src\Assets\IconLink.png" alt="LinkedIn" className="social-img" /> LinkedIn
            </div>
            <div className="social-item">
              <img src="src\Assets\IconYoutube.png" alt="Youtube" className="social-img" /> Youtube
            </div>
          </Col>
          <Col md={1} className="divider"></Col>
          <Col md={7} className="form-section">
            <h2 className="form-title">Contato</h2>
            <Form>
              <Form.Group controlId="formEmail">
                <Form.Label className="tamanho-font">Seu email:</Form.Label>
                <Form.Control type="email" className="form-input" />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group controlId="formNome">
                    <Form.Label>Nome:</Form.Label>
                    <Form.Control type="text" className="form-input" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formTelefone">
                    <Form.Label>Telefone:</Form.Label>
                    <Form.Control type="text" className="form-input" />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="formAssunto">
                <Form.Label>Assunto:</Form.Label>
                <Form.Control type="text" className="form-input" />
              </Form.Group>
              <Form.Group controlId="formMensagem">
                <Form.Label>Mensagem:</Form.Label>
                <Form.Control as="textarea" rows={3} className="form-input" />
              </Form.Group>
              <Button  type="submit" className="submit-button mt-3">
                Enviar
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      </div>
    </div>
  );
};

export default Contato;
