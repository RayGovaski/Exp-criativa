import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaFileDownload, FaSearch } from 'react-icons/fa'; // Mantenha FaSearch, remova FaFileDownload
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import './ComprovantesPerfil.css'; 

const ComprovantesPerfil = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [doacoes, setDoacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonationHistory = async () => {
      if (!isAuthenticated() || !user || user.role !== 'apoiador') {
        setError("Acesso negado. Esta seção é exclusiva para apoiadores logados.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8000/apoiador/historico-doacoes', { 
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoacoes(response.data);
      } catch (err) {
        console.error("Erro ao buscar histórico de doações:", err);
        setError("Falha ao carregar seu histórico de doações. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, [user, token, isAuthenticated]);

  const handleVerDetalhes = (doacao) => {
    setDoacaoSelecionada(doacao);
    setShowModal(true);
  };



  const doacoesFiltradas = doacoes.filter(
    doacao => doacao.causa.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) {
    return (
      <Card className="mb-4 shadow-sm p-4 text-center">
        <Spinner animation="border" role="status" className="mb-3" />
        <p>Carregando histórico de doações...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-4 shadow-sm p-4">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-4 shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="label-azul mb-0">Histórico de Doações</h4>
          <div className="d-flex align-items-center position-relative" style={{ width: '250px' }}>
            <Form.Control
              type="text"
              placeholder="Buscar doação..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="pe-4"
            />
            <FaSearch className="position-absolute search-icon" />
          </div>
        </div>

        {doacoesFiltradas.length > 0 ? (
          <Table striped hover responsive>
            <thead className="table-light">
              <tr>
                <th>Causa</th>
                <th>Valor</th>
                <th>Data</th>
                {/* REMOVIDO: <th>Status</th> */} 
                <th>Ações</th> {/* Mantenha o cabeçalho Ações se ainda tiver o botão Detalhes */}
              </tr>
            </thead>
            <tbody>
              {doacoesFiltradas.map((doacao) => (
                <tr key={doacao.id}>
                  <td>{doacao.causa}</td>
                  <td>R$ {doacao.valor.toFixed(2)}</td>
                  <td>{doacao.data}</td>
                  {/* REMOVIDO: Célula de Status */}
                  <td className="d-flex gap-2">
                    <Button 
                      className="btn-detalhes"
                      size="sm"
                      onClick={() => handleVerDetalhes(doacao)}
                    >
                      Detalhes
                    </Button>
                    {/* REMOVIDO: Botão de Comprovante */}
                    {/* {doacao.comprovante && (
                      <Button 
                        className="custom-button-azul"
                        size="sm"
                        onClick={() => handleDownloadComprovante(doacao.id)}
                      >
                        <FaFileDownload className="me-1" /> Comprovante
                      </Button>
                    )} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted mb-0">
              {filtro ? "Nenhuma doação encontrada com os termos de busca." : "Você ainda não realizou nenhuma doação."}
            </p>
          </div>
        )}
      </Card>

      {/* Modal de detalhes da doação */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <div className="registro-header-azul">
          <Modal.Title className="text-white">Detalhes da Doação</Modal.Title>
        </div>
        <Modal.Body className="p-4">
          {doacaoSelecionada && (
            <>
              <div className="mb-4 text-center">
                <h5 className="label-azul mb-1">{doacaoSelecionada.causa}</h5>
              </div>

              <div className="bg-light p-3 rounded mb-4">
                <div className="row mb-2">
                  <div className="col-5 fw-bold">Valor doado:</div>
                  <div className="col-7">R$ {doacaoSelecionada.valor.toFixed(2)}</div>
                </div>
                <div className="row mb-2">
                  <div className="col-5 fw-bold">Data da doação:</div>
                  <div className="col-7">{doacaoSelecionada.data}</div>
                </div>
                <div className="row mb-2">
                    <div className="col-5 fw-bold">Forma de pagamento:</div>
                    <div className="col-7">{doacaoSelecionada.formaPagamento || 'Não Informado'}</div> 
                </div>
              </div>

              <div className="mb-2">
                <h6 className="label-azul">Impacto da sua doação</h6>
                <p className="mb-0 small">
                  Sua contribuição ajudou diretamente a iniciativa "{doacaoSelecionada.causa}" que faz parte da Experiência Criativa. Os recursos foram destinados para {doacaoSelecionada.descricaoDetalhada ? doacaoSelecionada.descricaoDetalhada.toLowerCase() : 'os objetivos do projeto selecionado'}, beneficiando diretamente as pessoas e comunidades atendidas.
                </p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowModal(false)} 
            className="btn-fechar px-4"
          >
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ComprovantesPerfil;