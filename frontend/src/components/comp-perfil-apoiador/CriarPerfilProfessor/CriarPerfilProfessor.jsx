// CriarPerfilProfessor.jsx
import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap'; // Supondo que react-bootstrap seja usado
// IMPORTANTE: Certifique-se de que este ficheiro CSS (CriarPerfilProfessor.css)
// esteja no MESMO DIRETÓRIO que este ficheiro CriarPerfilProfessor.jsx.
import './CriarPerfilProfessor.css'; // Importa o CSS para este componente

const CriarPerfilProfessor = () => {
  // Estados para os campos do formulário
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [materiaPrincipal, setMateriaPrincipal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para criar um novo perfil de professor (ex: chamar uma API)
    console.log("Formulário de Criar Perfil de Professor submetido!");
    // Coletar os dados dos campos do formulário
    const newProfessorProfile = {
      nomeCompleto,
      email,
      cpf,
      telefone,
      materiaPrincipal,
    };
    console.log(newProfessorProfile);
    // Substituir por feedback real, como um modal de sucesso
    // alert("Funcionalidade de Criar Perfil de Professor em desenvolvimento!"); 

    // Opcional: Limpar o formulário após a submissão bem-sucedida
    setNomeCompleto('');
    setEmail('');
    setCpf('');
    setTelefone('');
    setMateriaPrincipal('');
  };

  return (
    <Card className="mb-4 shadow-sm p-4">
      <h4 className="label-azul mb-4">Criar Perfil de Professor</h4>
      <p>Preencha os dados para registar um novo professor na plataforma.</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formNomeProfessor">
          <Form.Label className="label-azul">Nome Completo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nome do Professor"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmailProfessor">
          <Form.Label className="label-azul">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="email@professor.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCPFProfessor">
          <Form.Label className="label-azul">CPF</Form.Label>
          <Form.Control
            type="text"
            placeholder="XXX.XXX.XXX-XX"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTelefoneProfessor">
          <Form.Label className="label-azul">Telefone</Form.Label>
          <Form.Control
            type="text"
            placeholder="(XX) XXXXX-XXXX"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formMateriaProfessor">
          <Form.Label className="label-azul">Matéria Principal</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ex: Matemática, Português"
            value={materiaPrincipal}
            onChange={(e) => setMateriaPrincipal(e.target.value)}
          />
        </Form.Group>

        <Button className="custom-button-azul5 mt-3" type="submit">
          Criar Professor
        </Button>
      </Form>
    </Card>
  );
};

export default CriarPerfilProfessor;
