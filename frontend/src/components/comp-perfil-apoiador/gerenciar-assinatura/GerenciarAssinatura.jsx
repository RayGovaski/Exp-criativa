import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaCreditCard, FaTrash } from 'react-icons/fa';
import './GerenciarAssinatura.css';
import { useNavigate } from 'react-router-dom';

const GerenciarAssinatura = () => {
  const navigate = useNavigate();
  const [assinaturaAtiva, setAssinaturaAtiva] = useState(true); // Initial state for subscription status
  const [showModalCartao, setShowModalCartao] = useState(false);
  const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null); // To store fetched subscription data

  const [formDadosCartao, setFormDadosCartao] = useState({
    numero: '•••• •••• •••• 4567', // These should ideally come from backend or be empty for new input
    nome: 'Maria Silva',
    validade: '12/26',
    cvv: '',
    salvarCartao: true
  });

  // Fetch subscription data on component mount
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          setError("Usuário não autenticado. Por favor, faça login novamente.");
          setLoading(false);
          return;
        }

        // Alterado para a rota /apoiador/profile
        const response = await fetch('http://localhost:8000/apoiador/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // Se o erro 404 for "Usuário não encontrado" ou se o plano não existe, não setar erro grave
          if (response.status === 404) {
            setSubscriptionData(null); // Limpa os dados se não encontrar o usuário ou plano
            setAssinaturaAtiva(false);
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setSubscriptionData(data);
          // Define `assinaturaAtiva` com base na existência de `plano_nome`
          setAssinaturaAtiva(!!data.plano_nome); 
        }

      } catch (err) {
        console.error("Erro ao buscar dados da assinatura:", err);
        setError("Erro ao carregar dados da assinatura. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []); // Empty dependency array means this runs once on mount

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormDadosCartao({
      ...formDadosCartao,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmitCartao = () => {
    console.log("Dados do cartão atualizados:", formDadosCartao);
    // In a real application, you'd send these to your backend
    setShowModalCartao(false);
  };

  const handleCancelarAssinatura = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            const response = await fetch('http://localhost:8000/apoiador/cancelar-assinatura', {
                method: 'DELETE', // <--- Alterado para DELETE
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json(); // Tenta ler a mensagem de erro do backend
                throw new Error(`Falha ao cancelar assinatura: ${errorData.error || response.statusText}`);
            }

            // Apenas uma mensagem de sucesso no frontend após a remoção bem-sucedida
            const successMessage = await response.json(); // Pode ser que o backend retorne { message: 'Assinatura cancelada com sucesso!' }
            
            // Atualiza o estado local para refletir o cancelamento
            setAssinaturaAtiva(false);
            setSubscriptionData(prevData => ({ ...prevData, plano_nome: null, plano_preco: null, data_adesao: null })); // Limpa os dados do plano
            setShowModalCancelar(false);

        } catch (err) {
            console.error("Erro ao cancelar assinatura:", err);
        }
    };

  const handleReativarAssinatura = () => {
    navigate('/assinaturas'); 
  };

  // Função para calcular a próxima data de cobrança
  const getNextBillingDate = (adhesionDate) => {
    if (!adhesionDate) return 'N/A';
    
    const date = new Date(adhesionDate);
    date.setMonth(date.getMonth() + 1); // Adiciona um mês
    
    // Formata a data para dd/mm/aaaa
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexado
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-4">
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Card className="mb-4 shadow-sm p-4">
        <h4 className="label-azul mb-4">Gerenciar Assinatura</h4>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="label-azul">Status da Assinatura</h5>
            <span className={`badge p-2 ${assinaturaAtiva ? 'bg-assinatura-ativa' : 'bg-danger'}`}>
              {assinaturaAtiva ? 'Ativa' : 'Inativa'}
            </span>
          </div>

          {assinaturaAtiva && subscriptionData?.plano_nome ? (
            <div className="bg-light p-3 rounded mb-3">
              <p className="mb-2"><strong>Plano:</strong> {subscriptionData.plano_nome}</p>
              {/* Exibe o preço do plano, se disponível */}
              <p className="mb-2">
                <strong>Valor:</strong> {subscriptionData.plano_preco ? `R$ ${parseFloat(subscriptionData.plano_preco).toFixed(2).replace('.', ',')}/mês` : 'N/A'}
              </p>
              {/* Usa a nova função para calcular a próxima data de cobrança */}
              <p className="mb-2">
                <strong>Próxima cobrança:</strong> {getNextBillingDate(subscriptionData.data_adesao)}
              </p>
            </div>
          ) : (
            <div className="bg-light p-3 rounded mb-3">
              <p className="mb-0">Você não possui um plano ativo no momento.</p>
            </div>
          )}

          <div className="d-flex justify-content-end">
            {assinaturaAtiva ? (
              <Button
                className="custom-button-vermelho me-2"
                onClick={() => setShowModalCancelar(true)}
              >
                Cancelar Assinatura
              </Button>
            ) : (
              <Button
                className="custom-button-azul"
                onClick={handleReativarAssinatura}
              >
                Ativar Assinatura
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Modal para atualizar cartão - This part remains largely the same, but consider if you want to allow card updates directly here or redirect to a separate payment page. */}
      <Modal show={showModalCartao} onHide={() => setShowModalCartao(false)} centered>
        <div className="registro-header-azul">
          <Modal.Title className="text-white">Dados do Cartão</Modal.Title>
        </div>
        <Modal.Body className="py-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="label-azul">Número do Cartão</Form.Label>
              <Form.Control
                type="text"
                name="numero"
                value={formDadosCartao.numero}
                onChange={handleInputChange}
                placeholder="0000 0000 0000 0000"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="label-azul">Nome no Cartão</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formDadosCartao.nome}
                onChange={handleInputChange}
                placeholder="Nome como no cartão"
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label className="label-azul">Data de Validade</Form.Label>
                  <Form.Control
                    type="text"
                    name="validade"
                    value={formDadosCartao.validade}
                    onChange={handleInputChange}
                    placeholder="MM/AA"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label className="label-azul">CVV</Form.Label>
                  <Form.Control
                    type="text"
                    name="cvv"
                    value={formDadosCartao.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Salvar este cartão para pagamentos futuros"
                name="salvarCartao"
                checked={formDadosCartao.salvarCartao}
                onChange={handleInputChange}
                className="radio-custom-azul"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
          <Button
            variant="outline-secondary"
            onClick={() => setShowModalCartao(false)}
            className="custom-button-outline px-4"
          >
            Cancelar
          </Button>
          <Button
            className="custom-button-azul px-4"
            onClick={handleSubmitCartao}
          >
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para confirmar cancelamento */}
      <Modal show={showModalCancelar} onHide={() => setShowModalCancelar(false)} centered>
        <div className="registro-header-vermelho">
          <Modal.Title className="text-white">Cancelar Assinatura</Modal.Title>
        </div>
        <Modal.Body className="py-4">
          <p className="mb-4">Tem certeza que deseja cancelar sua assinatura?</p>
          <p className="mb-3">Ao cancelar:</p>
          <ul>
            <li>Você perderá acesso aos recursos premium após o período atual</li>
            <li>Seu plano ficará ativo até a data da próxima cobrança</li>
            <li>Você pode reativar sua assinatura a qualquer momento</li>
          </ul>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
          <Button
            variant="outline-secondary"
            onClick={() => setShowModalCancelar(false)}
            className="custom-button-outline px-4"
          >
            Voltar
          </Button>
          <Button
            onClick={handleCancelarAssinatura}
            className="custom-button-vermelho px-4"
          >
            Confirmar Cancelamento
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GerenciarAssinatura;