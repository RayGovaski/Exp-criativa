// CriarTurma.jsx
import React from 'react';
import { Card, Form, Button } from 'react-bootstrap'; // Supondo que react-bootstrap seja usado

const CriarTurma = () => {
  // Você normalmente teria estado aqui para as entradas do formulário
  // Ex: const [nomeTurma, setNomeTurma] = useState('');
  // Ex: const [descricaoTurma, setDescricaoTurma] = useState('');
  // Ex: const [professorResponsavel, setProfessorResponsavel] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para criar uma nova turma (ex: chamar uma API)
    console.log("Formulário de Criar Turma submetido!");
    // Aqui você coletaria os dados dos campos do formulário e os enviaria
    // console.log({ nomeTurma, descricaoTurma, professorResponsavel });
    alert("Funcionalidade de Criar Turma em desenvolvimento!"); // Substituir por feedback real
  };

  return (
    <Card className="mb-4 shadow-sm p-4">
      <h4 className="label-azul mb-4">Criar Turma</h4>
      <p>Utilize este formulário para criar novas turmas e associar professores.</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formNomeTurma">
          <Form.Label className="label-azul">Nome da Turma</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Ex: Turma de Matemática Avançada" 
            // value={nomeTurma}
            // onChange={(e) => setNomeTurma(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDescricaoTurma">
          <Form.Label className="label-azul">Descrição</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3} 
            placeholder="Descreva o conteúdo da turma" 
            // value={descricaoTurma}
            // onChange={(e) => setDescricaoTurma(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formProfessorResponsavel">
          <Form.Label className="label-azul">Professor Responsável</Form.Label>
          {/* Este campo poderia ser um dropdown que carrega dinamicamente perfis de professores existentes */}
          <Form.Control 
            type="text" 
            placeholder="ID ou Nome do Professor" 
            // value={professorResponsavel}
            // onChange={(e) => setProfessorResponsavel(e.target.value)}
          />
        </Form.Group>

        <Button className="custom-button-azul5 mt-3" type="submit">
          Criar Turma
        </Button>
      </Form>
    </Card>
  );
};

export default CriarTurma;
