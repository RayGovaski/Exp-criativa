import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import MateriasAluno from '../adm/materias-aluno/MateriasAluno'; 
jest.mock('../MateriasAluno.css', () => ({})); 
let mockMateriasDisponiveis = [
  { 
    id: 1, 
    nome: 'Matemática Aplicada', 
    professor: 'Prof. Ana Silva', 
    descricao: 'Fundamentos...', 
    dataInicio: '15/07/2025', 
    horario: '08:00',
    sala: 'Sala 101'
  },
  { 
    id: 2, 
    nome: 'Português: Escrita Criativa', 
    professor: 'Prof. João Santos', 
    descricao: 'Desenvolva...', 
    dataInicio: '20/07/2025', 
    horario: '14:00',
    sala: 'Sala 203'
  },
];
jest.mock('../../data/materiasDisponiveis', () => ({ 
    materiasDisponiveis: mockMateriasDisponiveis 
}));
describe('MateriasAluno', () => {
  let consoleSpy;
  let alertSpy;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });
  test('deve renderizar o título e a lista de matérias disponíveis', () => {
    render(<MateriasAluno />);
    expect(screen.getByRole('heading', { name: /Matérias Disponíveis para Inscrição/i })).toBeInTheDocument();
    expect(screen.getByText('Matemática Aplicada')).toBeInTheDocument();
    expect(screen.getByText('Prof. Ana Silva')).toBeInTheDocument();
    expect(screen.getByText('Português: Escrita Criativa')).toBeInTheDocument();
    expect(screen.getByText('Prof. João Santos')).toBeInTheDocument();
  });
  test('deve abrir o modal ao clicar em "Inscrever-se" e fechar ao clicar em "Cancelar"', async () => {
    render(<MateriasAluno />);
    const inscreverButton = screen.getByRole('button', { name: /Inscrever-se/i });
    fireEvent.click(inscreverButton);
    await waitFor(() => { 
      expect(screen.getByText(/Confirmar Inscrição/i)).toBeInTheDocument();
      expect(screen.getByText('Matemática Aplicada')).toBeInTheDocument(); 
    });
    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(screen.queryByText(/Confirmar Inscrição/i)).not.toBeInTheDocument();
    });
  });
  test('deve confirmar a inscrição, logar a matéria e disparar o alert de sucesso', async () => {
    render(<MateriasAluno />);
    const inscreverButton = screen.getByRole('button', { name: /Inscrever-se/i });
    fireEvent.click(inscreverButton);
    await waitFor(() => {
      expect(screen.getByText(/Confirmar Inscrição/i)).toBeInTheDocument();
    });
    const termosCheckbox = screen.getByLabelText(/Li e aceito os termos de inscrição para esta matéria./i);
    fireEvent.click(termosCheckbox); 
    const confirmarInscricaoButton = screen.getByRole('button', { name: /Confirmar Inscrição/i });
    expect(confirmarInscricaoButton).toBeEnabled(); 
    fireEvent.click(confirmarInscricaoButton);
    expect(consoleSpy).toHaveBeenCalledWith('Aluno inscrito na matéria: Matemática Aplicada');
    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith('Você se inscreveu na matéria: Matemática Aplicada!');
    await waitFor(() => {
      expect(screen.queryByText(/Confirmar Inscrição/i)).not.toBeInTheDocument();
    });
  });
  test('não deve inscrever-se e deve exibir alerta se os termos não forem aceitos', async () => {
    render(<MateriasAluno />);
    const inscreverButton = screen.getByRole('button', { name: /Inscrever-se/i });
    fireEvent.click(inscreverButton);
    await waitFor(() => {
      expect(screen.getByText(/Confirmar Inscrição/i)).toBeInTheDocument();
    });
    const confirmarInscricaoButton = screen.getByRole('button', { name: /Confirmar Inscrição/i });
    expect(confirmarInscricaoButton).toBeDisabled(); 
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Aluno inscrito na matéria:'));
    expect(alertSpy).not.toHaveBeenCalledWith(expect.stringContaining('Você se inscreveu na matéria:'));
  });
  test('deve exibir mensagem de "Nenhuma matéria disponível" se a lista estiver vazia', () => {
    const originalMaterias = [...MateriasAluno.materiasDisponiveis]; 
    MateriasAluno.materiasDisponiveis = []; 
    render(<MateriasAluno />);
    expect(screen.getByText(/Nenhuma matéria disponível para inscrição no momento./i)).toBeInTheDocument();
    expect(screen.queryByText('Matemática Aplicada')).not.toBeInTheDocument(); 
    MateriasAluno.materiasDisponiveis = originalMaterias; 
  });
});