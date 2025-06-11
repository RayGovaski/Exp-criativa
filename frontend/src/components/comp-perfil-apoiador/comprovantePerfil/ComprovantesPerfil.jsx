import React, { useState } from 'react';
import { Card, Button, Table, Badge, Form, Modal } from 'react-bootstrap';
import { FaFileDownload, FaSearch } from 'react-icons/fa';
import './ComprovantesPerfil.css';

const ComprovantesPerfil = () => {
  const [showModal, setShowModal] = useState(false);
  const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);
  const [filtro, setFiltro] = useState('');
  
  // Dados de exemplo de doações
  const [doacoes] = useState([
    {
      id: 1,
      causa: "Campanha Educação para Todos",
      instituicao: "Instituto Educar",
      valor: 50.00,
      data: "10/04/2025",
      status: "Concluída",
      comprovante: true
    },
    {
      id: 2,
      causa: "Reflorestamento Mata Atlântica",
      instituicao: "ONG Natureza Viva",
      valor: 75.00,
      data: "28/03/2025",
      status: "Concluída",
      comprovante: true
    },
    {
      id: 3,
      causa: "Assistência a Desabrigados",
      instituicao: "Abrigo Solidário",
      valor: 100.00,
      data: "15/03/2025",
      status: "Concluída",
      comprovante: true
    },
    {
      id: 4,
      causa: "Campanha de Vacinação Animal",
      instituicao: "Proteção Pet",
      valor: 45.00,
      data: "05/03/2025",
      status: "Concluída",
      comprovante: true
    },
    {
      id: 5,
      causa: "Reforma Biblioteca Comunitária",
      instituicao: "Amigos da Leitura",
      valor: 120.00,
      data: "20/02/2025",
      status: "Concluída",
      comprovante: true
    }
  ]);

  const handleVerDetalhes = (doacao) => {
    setDoacaoSelecionada(doacao);
    setShowModal(true);
  };

  const handleDownloadComprovante = (id) => {
    console.log(`Baixando comprovante da doação ${id}`);
    // Aqui implementaria a lógica para download do comprovante
  };

  const doacoesFiltradas = doacoes.filter(
    doacao => doacao.causa.toLowerCase().includes(filtro.toLowerCase()) ||
              doacao.instituicao.toLowerCase().includes(filtro.toLowerCase())
  );

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
                <th>Instituição</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {doacoesFiltradas.map((doacao) => (
                <tr key={doacao.id}>
                  <td>{doacao.causa}</td>
                  <td>{doacao.instituicao}</td>
                  <td>R$ {doacao.valor.toFixed(2)}</td>
                  <td>{doacao.data}</td>
                  <td>
                    <Badge className="custom-badge">
                      {doacao.status}
                    </Badge>
                  </td>
                  <td className="d-flex gap-2">
                    <Button 
                      className="btn-detalhes"
                      size="sm"
                      onClick={() => handleVerDetalhes(doacao)}
                    >
                      Detalhes
                    </Button>
                    {doacao.comprovante && (
                      <Button 
                        className="custom-button-azul"
                        size="sm"
                        onClick={() => handleDownloadComprovante(doacao.id)}
                      >
                        <FaFileDownload className="me-1" /> Comprovante
                      </Button>
                    )}
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
                <p className="text-muted">{doacaoSelecionada.instituicao}</p>
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
                  <div className="col-5 fw-bold">Status:</div>
                  <div className="col-7">
                    <Badge className="custom-badge">
                      {doacaoSelecionada.status}
                    </Badge>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-5 fw-bold">Forma de pagamento:</div>
                  <div className="col-7">Cartão de crédito •••• 4567</div>
                </div>
                <div className="row">
                  <div className="col-5 fw-bold">ID da transação:</div>
                  <div className="col-7">DOA{String(doacaoSelecionada.id).padStart(8, '0')}</div>
                </div>
              </div>

              <div className="mb-2">
                <h6 className="label-azul">Impacto da sua doação</h6>
                <p className="mb-0 small">
                  Sua contribuição ajudou diretamente a instituição {doacaoSelecionada.instituicao} a avançar em seus projetos. 
                  Os recursos foram destinados para {doacaoSelecionada.causa.toLowerCase()}, beneficiando diretamente as pessoas 
                  e comunidades atendidas.
                </p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
          {doacaoSelecionada && doacaoSelecionada.comprovante && (
            <Button 
              className="custom-button-azul px-4" 
              onClick={() => handleDownloadComprovante(doacaoSelecionada.id)}
            >
              <FaFileDownload className="me-2" /> Baixar Comprovante
            </Button>
          )}
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