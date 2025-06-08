import React, { useState } from 'react';
import { Card, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { FaCreditCard, FaTrash } from 'react-icons/fa';
import './GerenciarAssinatura.css'; // Importamos um novo arquivo CSS para os estilos personalizados

const GerenciarAssinatura = () => {
  const [assinaturaAtiva, setAssinaturaAtiva] = useState(true);
  const [showModalCartao, setShowModalCartao] = useState(false);
  const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [formDadosCartao, setFormDadosCartao] = useState({
    numero: '•••• •••• •••• 4567',
    nome: 'Maria Silva',
    validade: '12/26',
    cvv: '',
    salvarCartao: true
  });
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormDadosCartao({
      ...formDadosCartao,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmitCartao = () => {
    console.log("Dados do cartão atualizados:", formDadosCartao);
    setShowModalCartao(false);
  };
  
  const handleCancelarAssinatura = () => {
    setAssinaturaAtiva(false);
    setShowModalCancelar(false);
  };
  
  const handleReativarAssinatura = () => {
    setAssinaturaAtiva(true);
  };

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
          
          {assinaturaAtiva ? (
            <div className="bg-light p-3 rounded mb-3">
              <p className="mb-2"><strong>Plano:</strong> Premium Mensal</p>
              <p className="mb-2"><strong>Valor:</strong> R$ 29,90/mês</p>
              <p className="mb-2"><strong>Próxima cobrança:</strong> 15/05/2025</p>
              <p className="mb-0"><strong>Método de pagamento:</strong> Cartão de crédito final 4567</p>
            </div>
          ) : (
            <div className="bg-light p-3 rounded mb-3">
              <p className="mb-2">Sua assinatura foi cancelada.</p>
              <p className="mb-0">Você ainda terá acesso aos recursos premium até o fim do período pago.</p>
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
                Reativar Assinatura
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Modal para atualizar cartão nao usar esse */}
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