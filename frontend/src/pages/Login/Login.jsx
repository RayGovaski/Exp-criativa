// src/pages/Login/Login.jsx

import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext'; // Certifique-se que o caminho está correto
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Obtenha 'user' do contexto para decidir a navegação pós-login
  const { login, isAuthenticated, user } = useAuth(); 
  const navigate = useNavigate();

  // Redireciona se já estiver logado (e a role estiver definida)
 useEffect(() => {
    if (isAuthenticated() && user) {
        switch (user.role) {
            case 'apoiador':
                navigate('/perfil');
                break;
            case 'aluno':
                navigate('/perfil-aluno');
                break;
            case 'professor':
                navigate('/perfil-professor');
                break;
            case 'administrador': // Se tiver um perfil para ADM
                navigate('/perfil-adm');
                break;
            default:
                navigate('/'); // Fallback
        }
    }
}, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validações iniciais (mantidas)
    if (!email || !senha) {
      toast.error("Por favor, preencha todos os campos.");
      setIsLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, insira um endereço de e-mail válido.");
      setIsLoading(false);
      return;
    }

    toast.info("Entrando...", { autoClose: false, closeButton: false, toastId: 'loginProcess' });

    try {
      const result = await login(email, senha); // Chama a função login do contexto

      toast.dismiss('loginProcess'); // Remove o toast "Entrando..."

      if (result.success) {
        toast.success("Login bem-sucedido!");
        // A navegação real agora é tratada pelo useEffect acima, o que é mais limpo e reativo.
      } else {
        toast.error(result.error || 'Falha ao realizar login. Verifique suas credenciais.');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.dismiss('loginProcess');
      toast.error('Ocorreu um erro durante o login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-bg d-flex justify-content-center align-items-center">
      <Container className="d-flex justify-content-center">
        <Card className="p-0 login-card">
          <div className="registro-header-azul">
            <h4 className="m-0">Login</h4>
          </div>
          <Card.Body className="p-4">
            <h3 className="text-center login-title mb-4">Seja bem-vindo de novo!</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label className="label-azul">Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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