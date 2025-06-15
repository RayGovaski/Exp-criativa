import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CriarTurma from '../adm/CriarTurma/CriarTurma'; 
describe('CriarTurma', () => {
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
  test('deve renderizar todos os campos do formulário e o botão de submissão', () => {
    render(<CriarTurma />);
    expect(screen.getByRole('heading', { name: /Criar Turma/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome da Turma/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Professor Responsável/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Criar Turma/i })).toBeInTheDocument();
  });
  test('deve submeter o formulário e chamar o alert de funcionalidade em desenvolvimento', async () => {
    render(<CriarTurma />);
    const submitButton = screen.getByRole('button', { name: /Criar Turma/i });
    await act(async () => {
      fireEvent.click(submitButton); 
    });
    expect(consoleSpy).toHaveBeenCalledWith('Formulário de Criar Turma submetido!');
    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith('Funcionalidade de Criar Turma em desenvolvimento!');
  });
});