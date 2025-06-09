import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify'; // Importa a função toast
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/perfil');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Ativa o spinner no botão

    // --- 1. VALIDAÇÕES INICIAIS (antes de qualquer toast.info ou requisição) ---
    // Validação de campos vazios
    if (!email || !senha) {
      toast.error("Por favor, preencha todos os campos.");
      setIsLoading(false); // Desativa o spinner imediatamente
      return; // Para a execução
    }

    // Validação de formato de email (se type="text")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, insira um endereço de e-mail válido.");
      setIsLoading(false); // Desativa o spinner imediatamente
      return; // Para a execução
    }

    // --- 2. TENTATIVA DE LOGIN E EXIBIÇÃO DO TOAST DE "ENTRANDO..." ---
    // Só chegaremos aqui se as validações acima passarem.
    // Agora é o momento certo para mostrar o "Entrando..."
    toast.info("Entrando...", { autoClose: false, closeButton: false, toastId: 'loginProcess' }); // Usamos toastId para poder atualizá-lo/removê-lo

    try {
      const result = await login(email, senha);

      // Remover o toast de "Entrando..." antes de mostrar o resultado
      toast.dismiss('loginProcess'); // Remove a notificação "Entrando..."

      if (result.success) {
        toast.success("Login bem-sucedido!");
        // A navegação pode ser controlada pelo useEffect, ou aqui com um pequeno delay se preferir
        // setTimeout(() => navigate('/perfil'), 1000);
      } else {
        toast.error(result.error || 'Falha ao realizar login. Verifique suas credenciais.');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.dismiss('loginProcess'); // Remover o toast de "Entrando..." em caso de erro de rede/servidor
      toast.error('Ocorreu um erro durante o login. Tente novamente.');
    } finally {
      setIsLoading(false); // Desativa o spinner sempre no final
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
                  type="text" // Mantido como 'text' para o toast lidar com a validação
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