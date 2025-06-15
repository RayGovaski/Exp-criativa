// CriarCardDoacao.jsx
import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap'; // Supondo que react-bootstrap seja usado
// IMPORTANTE: Certifique-se de que este ficheiro CSS (CriarCardDoacao.css)
// esteja no MESMO DIRETÓRIO que este ficheiro CriarCardDoacao.jsx.
import './CriarCardDoacao.css'; // Importa o CSS para este componente

const CriarCardDoacao = () => {
  // Estados para os campos do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [meta, setMeta] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para criar um novo card de doação (ex: chamar uma API)
    console.log("Formulário de Criar Card de Doação submetido!");
    // Coletar os dados dos campos do formulário
    const newDonationCard = {
      titulo,
      descricao,
      meta: parseFloat(meta), // Converte a meta para número
      imagemUrl,
    };
    console.log(newDonationCard);
    // Substituir por feedback real, como um modal de sucesso
    // alert("Funcionalidade de Criar Card de Doação em desenvolvimento!"); 

    // Opcional: Limpar o formulário após a submissão bem-sucedida
    setTitulo('');
    setDescricao('');
    setMeta('');
    setImagemUrl('');
  };

  return (
    <Card className="mb-4 shadow-sm p-4">
      <h4 className="label-azul mb-4">Criar Card de Doação</h4>
      <p>Crie um novo card para solicitar doações com detalhes específicos.</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTituloDoacao">
          <Form.Label className="label-azul">Título da Doação</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ex: Doação para Material Escolar"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required // Torna o campo obrigatório
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescricaoDoacao">
          <Form.Label className="label-azul">Descrição</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Descreva a finalidade da doação"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formMetaDoacao">
          <Form.Label className="label-azul">Meta ($)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ex: 5000.00"
            step="0.01" // Permite valores decimais para dinheiro
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formImagemDoacao">
          <Form.Label className="label-azul">URL da Imagem (Opcional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="https://exemplo.com/imagem.jpg"
            value={imagemUrl}
            onChange={(e) => setImagemUrl(e.target.value)}
          />
        </Form.Group>

        <Button className="custom-button-azul5 mt-3" type="submit">
          Criar Card
        </Button>
      </Form>
    </Card>
  );
};

export default CriarCardDoacao;
