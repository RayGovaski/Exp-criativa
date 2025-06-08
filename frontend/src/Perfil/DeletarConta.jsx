import React, { useState } from 'react';
import { Card, Button, Form, Alert, Modal } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const DeletarConta = () => {
  const [showModal, setShowModal] = useState(false);
  const [confirmacao, setConfirmacao] = useState('');
  const [motivo, setMotivo] = useState('');
  const [senha, setSenha] = useState('');

  const handleDeletarConta = () => {
    console.log("Conta deletada com motivo:", motivo);
    setShowModal(false);
    // Aqui você adicionaria a lógica para realmente deletar a conta
    // e redirecionar para a página inicial/logout
  };

  return (
    <>
      <Card className="mb-4 shadow-sm p-4">
        <h4 className="label-azul mb-4">Deletar Conta</h4>
        
        <Alert variant="warning" className="mb-4">
          <div className="d-flex align-items-center mb-2">
            <FaExclamationTriangle className="me-2" />
            <strong>Atenção! Esta ação não pode ser desfeita.</strong>
          </div>
          <p className="mb-0">
            Ao deletar sua conta, todos os seus dados, histórico de atividades e informações pessoais serão permanentemente removidos do nosso sistema.
          </p>
        </Alert>
        
        <div className="mb-4">
          <h5 className="label-azul mb-3">Antes de prosseguir, considere:</h5>
          <ul>
            <li className="mb-2">Seus relatórios de voluntariado e histórico de participação serão apagados</li>
            <li className="mb-2">Certificados e comprovantes emitidos não poderão mais ser acessados</li>
            <li className="mb-2">Se você tem uma assinatura ativa, ela será automaticamente cancelada</li>
            <li>Você não receberá reembolso por pagamentos já efetuados</li>
          </ul>
        </div>
        
        <div className="bg-light p-3 rounded mb-4">
          <h6 className="label-azul mb-3">Alternativas a considerar:</h6>
          <ul className="mb-0">
            <li className="mb-2">Deseja apenas <strong>cancelar sua assinatura</strong>? Acesse a seção "Assinatura".</li>
            <li className="mb-2">Deseja <strong>desativar temporariamente</strong>? Entre em contato com nosso suporte.</li>
            <li>Está com problemas na plataforma? Ficaríamos felizes em ajudar através do nosso suporte.</li>
          </ul>
        </div>
        
        <div className="text-center">
          <Button 
            variant="danger" 
            onClick={() => setShowModal(true)}
          >
            Solicitar exclusão da minha conta
          </Button>
        </div>
      </Card>

      {/* Modal de confirmação */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        backdrop="static"
        size="lg"
        centered
      >
        <div className="bg-danger text-white p-3">
          <Modal.Title className="text-center">Exclusão de conta</Modal.Title>
        </div>
        <Modal.Body className="py-4">
          <p className="fw-bold text-danger text-center mb-4">
            Esta ação é irreversível e todos os seus dados serão apagados permanentemente
          </p>
          
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="label-azul">Por que você está deletando sua conta?</Form.Label>
              <Form.Select 
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                required
              >
                <option value="">Selecione um motivo...</option>
                <option value="nao_uso">Não utilizo mais o serviço</option>
                <option value="experiencia_ruim">Tive uma experiência ruim</option>
                <option value="alternativa">Encontrei uma alternativa melhor</option>
                <option value="temporario">Estou criando uma nova conta</option>
                <option value="privacidade">Preocupações com privacidade</option>
                <option value="outro">Outro motivo</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="label-azul">Digite sua senha para confirmar</Form.Label>
              <Form.Control 
                type="password" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="label-azul">
                Digite "DELETAR MINHA CONTA" para confirmar
              </Form.Label>
              <Form.Control 
                type="text" 
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Isso confirma que você entende que esta ação não pode ser desfeita.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowModal(false)} 
            className="custom-button-outline px-4"
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeletarConta}
            disabled={confirmacao !== "DELETAR MINHA CONTA" || !senha || !motivo}
            className="px-4"
          >
            Deletar permanentemente
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeletarConta;