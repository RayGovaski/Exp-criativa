import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CriarPerfilProfessor from '../adm/CriarPerfilProfessor/CriarPerfilProfessor'; 
jest.mock('../CriarPerfilProfessor.css', () => ({})); 
describe('CriarPerfilProfessor', () => {
  let consoleSpy;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleSpy.mockRestore();
  });
  test('deve renderizar todos os campos do formulário e o botão de submissão', () => {
    render(<CriarPerfilProfessor />);
    expect(screen.getByRole('heading', { name: /Criar Perfil de Professor/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Matéria Principal/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Criar Professor/i })).toBeInTheDocument();
  });
  test('deve preencher e submeter o formulário com dados válidos, limpar os campos e logar os dados corretos', async () => {
    render(<CriarPerfilProfessor />);
    const nomeInput = screen.getByLabelText(/Nome Completo/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const cpfInput = screen.getByLabelText(/CPF/i);
    const telefoneInput = screen.getByLabelText(/Telefone/i);
    const materiaInput = screen.getByLabelText(/Matéria Principal/i);
    const submitButton = screen.getByRole('button', { name: /Criar Professor/i });
    fireEvent.change(nomeInput, { target: { value: 'Prof. João Silva' } });
    fireEvent.change(emailInput, { target: { value: 'joao.silva@escola.com' } });
    fireEvent.change(cpfInput, { target: { value: '123.456.789-00' } });
    fireEvent.change(telefoneInput, { target: { value: '(11) 98765-4321' } });
    fireEvent.change(materiaInput, { target: { value: 'Matemática' } });
    expect(nomeInput).toHaveValue('Prof. João Silva');
    expect(emailInput).toHaveValue('joao.silva@escola.com');
    expect(cpfInput).toHaveValue('123.456.789-00');
    expect(telefoneInput).toHaveValue('(11) 98765-4321');
    expect(materiaInput).toHaveValue('Matemática');
    await act(async () => {
      fireEvent.click(submitButton); 
    });
    expect(consoleSpy).toHaveBeenCalledWith('Formulário de Criar Perfil de Professor submetido!');
    expect(consoleSpy).toHaveBeenCalledWith({
      nomeCompleto: 'Prof. João Silva',
      email: 'joao.silva@escola.com',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      materiaPrincipal: 'Matemática',
    });
    expect(nomeInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(cpfInput).toHaveValue('');
    expect(telefoneInput).toHaveValue('');
    expect(materiaInput).toHaveValue('');
  });
});