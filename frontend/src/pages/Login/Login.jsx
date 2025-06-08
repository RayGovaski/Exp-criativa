import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/perfil'); // Redirect to your main perfil or home page
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login(email, senha);
      
      if (result.success) {
        // Login successful, navigation is handled in the useEffect
        navigate('/perfil'); // Redirect to your main perfil or home page
      } else {
        // Display error message
        setError(result.error || 'Falha ao realizar login. Verifique suas credenciais.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ocorreu um erro durante o login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
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
            
            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label className="label-azul">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </Form.Group>
              <div className="d-flex justify-content-between mb-3">
                <Link to="/esqueceu-senha" className="forgot-link">Esqueceu a senha?</Link>
                <Link to="/menu-registro" className="forgot-link">Criar conta</Link>
              </div>
              <div className="text-center">
                <Button 
                  type="submit" 
                  className="custom-button-azul" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;