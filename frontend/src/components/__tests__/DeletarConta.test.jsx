import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import DeletarConta from '../comp-perfil-apoiador/deletar-perfil/DeletarConta'; 
jest.mock('react-icons/fa', () => ({
  FaExclamationTriangle: () => <svg data-testid="icon-warning" />,
}));
describe('DeletarConta', () => {
  let consoleSpy;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleSpy.mockRestore();
  });
  test('deve renderizar o título da seção, o alerta de atenção e as informações antes da deleção', () => {
    render(<DeletarConta />);
    expect(screen.getByRole('heading', { name: /Deletar Conta/i })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Atenção! Esta ação não pode ser desfeita./i)).toBeInTheDocument();
    expect(screen.getByTestId('icon-warning')).toBeInTheDocument(); 
    expect(screen.getByText(/Antes de prosseguir, considere:/i)).toBeInTheDocument();
    expect(screen.getByText(/Alternativas a considerar:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Solicitar exclusão da minha conta/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Exclusão de conta/i })).not.toBeInTheDocument();
  });
  test('deve abrir o modal de confirmação ao clicar em "Solicitar exclusão" e fechar ao clicar em "Cancelar"', async () => {
    render(<DeletarConta />);
    const solicitarExclusaoButton = screen.getByRole('button', { name: /Solicitar exclusão da minha conta/i });
    fireEvent.click(solicitarExclusaoButton);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Exclusão de conta/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Por que você está deletando sua conta?/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Digite sua senha para confirmar/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Digite "DELETAR MINHA CONTA" para confirmar/i)).toBeInTheDocument();
    });
    const deletarPermanentementeButton = screen.getByRole('button', { name: /Deletar permanentemente/i });
    expect(deletarPermanentementeButton).toBeDisabled();
    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Exclusão de conta/i })).not.toBeInTheDocument();
    });
  });
  test('o botão "Deletar permanentemente" deve ser habilitado apenas quando todos os campos obrigatórios estiverem preenchidos corretamente', async () => {
    render(<DeletarConta />);
    fireEvent.click(screen.getByRole('button', { name: /Solicitar exclusão da minha conta/i })); 
    await waitFor(() => {  });
    const motivoSelect = screen.getByLabelText(/Por que você está deletando sua conta?/i);
    const senhaInput = screen.getByLabelText(/Digite sua senha para confirmar/i);
    const confirmacaoInput = screen.getByLabelText(/Digite "DELETAR MINHA CONTA" para confirmar/i);
    const deletarPermanentementeButton = screen.getByRole('button', { name: /Deletar permanentemente/i });
    expect(deletarPermanentementeButton).toBeDisabled();
    fireEvent.change(motivoSelect, { target: { value: 'nao_uso' } });
    expect(deletarPermanentementeButton).toBeDisabled();
    fireEvent.change(senhaInput, { target: { value: 'minhasenha123' } });
    expect(deletarPermanentementeButton).toBeDisabled();
    fireEvent.change(confirmacaoInput, { target: { value: 'DELETAR MINHA CONTA ERRADO' } });
    expect(deletarPermanentementeButton).toBeDisabled();
    fireEvent.change(confirmacaoInput, { target: { value: 'DELETAR MINHA CONTA' } });
    await waitFor(() => { 
        expect(deletarPermanentementeButton).toBeEnabled();
    });
  });
  test('deve preencher os campos, clicar em "Deletar permanentemente", logar o motivo e fechar o modal', async () => {
    render(<DeletarConta />);
    fireEvent.click(screen.getByRole('button', { name: /Solicitar exclusão da minha conta/i })); 
    await waitFor(() => {  });
    const motivoSelect = screen.getByLabelText(/Por que você está deletando sua conta?/i);
    const senhaInput = screen.getByLabelText(/Digite sua senha para confirmar/i);
    const confirmacaoInput = screen.getByLabelText(/Digite "DELETAR MINHA CONTA" para confirmar/i);
    const deletarPermanentementeButton = screen.getByRole('button', { name: /Deletar permanentemente/i });
    fireEvent.change(motivoSelect, { target: { value: 'nao_uso' } });
    fireEvent.change(senhaInput, { target: { value: 'minhasenha123' } });
    fireEvent.change(confirmacaoInput, { target: { value: 'DELETAR MINHA CONTA' } });
    await waitFor(() => {  }); 
    await act(async () => { 
      fireEvent.click(deletarPermanentementeButton);
    });
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('Conta deletada com motivo:', 'nao_uso');
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Exclusão de conta/i })).not.toBeInTheDocument();
    });
  });
  test('não deve deletar a conta se o usuário clicar em "Cancelar" no modal', async () => {
    render(<DeletarConta />);
    fireEvent.click(screen.getByRole('button', { name: /Solicitar exclusão da minha conta/i })); 
    await waitFor(() => {  });
    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Conta deletada com motivo:'));
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Exclusão de conta/i })).not.toBeInTheDocument();
    });
  });
});