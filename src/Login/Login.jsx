import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Senha:", senha);
  };

  return (
    <div className="login-bg d-flex justify-content-center align-items-center">
      <Container className="d-flex justify-content-center">
        <Card className="p-0 login-card">
          
          {/* Cabeçalho azul dentro do Card */}
          <div className="registro-header-azul">
            <h4 className="m-0">Login</h4>
          </div>

          <Card.Body className="p-4">
            <h3 className="text-center login-title mb-4">Seja bem-vindo de novo!</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label className="label-azul">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formSenha" className="mb-3">
                <Form.Label className="label-azul">Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-between mb-3">
                <Link to="/esqueceu-senha" className="forgot-link">Esqueceu a senha?</Link>
                <Link to="/menu-registro" className="forgot-link">Criar conta</Link>
              </div>

              <div className="text-center">
                <Button type="submit" className="custom-button-azul">Entrar</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
