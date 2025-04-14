import React from 'react';
import { Card } from 'react-bootstrap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';

const dadosAtividades = [
  { name: 'Janeiro', horas: 20 },
  { name: 'Fevereiro', horas: 15 },
  { name: 'Março', horas: 25 },
  { name: 'Abril', horas: 18 },
];

const dadosCategorias = [
  { name: 'Musica', value: 40 },
  { name: 'Teatro', value: 30 },
  { name: 'Arte', value: 30 },
];

const cores = ['#0A7D7E', '#76B5A0', '#B3E0C2'];

const RelatoriosPerfil = () => {
  return (
    <Card className="mb-4 shadow-sm p-3">
      <h4 className="label-azul mb-4">Relatórios de Participação</h4>

      <div className="row">
        <div className="col-md-6">
          <h6 className="label-azul">Horas por Mês</h6>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dadosAtividades}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="horas" fill="#0A7D7E" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6">
          <h6 className="label-azul">Categorias de Ação</h6>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dadosCategorias}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {dadosCategorias.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default RelatoriosPerfil;
