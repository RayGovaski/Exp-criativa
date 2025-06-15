import React from 'react';
import { render, screen } from '@testing-library/react';
import SalaAluno from '../adm/sala-aluno/SalaAluno'; 
jest.mock('../SalaAluno.css', () => ({})); 
describe('SalaAluno', () => {
  const aulasComDados = [
    { id: 1, dia: 'Segunda-feira', nomeSala: 'Sala Alpha', professor: 'Prof. Ana Silva', horario: '08:00 - 09:30', atividade: 'Matemática Avançada' },
    { id: 2, dia: 'Terça-feira', nomeSala: 'Estúdio de Arte', professor: 'Prof. João Santos', horario: '10:00 - 11:30', atividade: 'Português Criativo' },
  ];
  const aulasVazias = [];
  test('deve renderizar o título e a tabela com as aulas inscritas', () => {
    render(<SalaAluno aulas={aulasComDados} />);
    expect(screen.getByRole('heading', { name: /Minhas Aulas Inscritas/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Dia/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Horário/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Sala/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Atividade/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Professor\(a\)/i })).toBeInTheDocument();
    expect(screen.getByText('Matemática Avançada')).toBeInTheDocument();
    expect(screen.getByText('Prof. Ana Silva')).toBeInTheDocument();
    expect(screen.getByText('Segunda-feira')).toBeInTheDocument();
    expect(screen.getByText('08:00 - 09:30')).toBeInTheDocument();
    expect(screen.getByText('Sala Alpha')).toBeInTheDocument();
    expect(screen.getByText('Português Criativo')).toBeInTheDocument();
    expect(screen.getByText('Prof. João Santos')).toBeInTheDocument();
    expect(screen.getByText('Terça-feira')).toBeInTheDocument();
    expect(screen.getByText('10:00 - 11:30')).toBeInTheDocument();
    expect(screen.getByText('Estúdio de Arte')).toBeInTheDocument();
    expect(screen.queryByText(/Você ainda não está inscrito em nenhuma aula./i)).not.toBeInTheDocument();
  });
  test('deve exibir a mensagem de "nenhuma aula disponível" quando não há aulas inscritas', () => {
    render(<SalaAluno aulas={aulasVazias} />);
    expect(screen.getByRole('heading', { name: /Minhas Aulas Inscritas/i })).toBeInTheDocument();
    expect(screen.getByText(/Você ainda não está inscrito em nenhuma aula./i)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});