import React from 'react';
import { Card } from 'react-bootstrap';

const OutrosRecursos = () => {
  return (
    <Card className="mb-4 shadow-sm p-3">
      <h4 className="label-azul mb-3">Outros Recursos</h4>
      <p>
        Aqui você pode adicionar mais funcionalidades como:
      </p>
      <ul>
        <li>Certificados de participação</li>
        <li>Histórico de voluntariado</li>
        <li>Feedbacks recebidos</li>
        <li>Badges ou selos sociais</li>
      </ul>
    </Card>
  );
};

export default OutrosRecursos;
