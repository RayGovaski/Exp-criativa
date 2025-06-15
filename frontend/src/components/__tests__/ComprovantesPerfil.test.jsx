import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ComprovantesPerfil from '../comp-perfil-apoiador/comprovantePerfil/ComprovantesPerfil'; 
jest.mock('../comp-perfil-apoiador/comprovantePerfil/ComprovantesPerfil.css', () => ({}));
jest.mock('react-icons/fa', () => ({
  FaFileDownload: () => <svg data-testid="icon-download" />,
  FaSearch: () => <svg data-testid="icon-search" />,
}));
import axios from 'axios';
jest.mock('axios');
const mockUseAuth = jest.fn();
jest.mock('src/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));
describe('ComprovantesPerfil', () => {
  let consoleErrorSpy;
  let alertSpy;
  const mockDoacoesApoiador = [
    {
      id: 1,
      causa: 'Alfabetização Infantil',
      valor: 150.00,
      data: '2024-05-10',
      status: 'Confirmada',
      comprovante: true,
      descricaoDetalhada: 'compra de livros e material didático para 20 crianças.',
    },
    {
      id: 2,
      causa: 'Campanha de Agasalhos',
      valor: 200.50,
      data: '2024-04-20',
      status: 'Pendente',
      comprovante: false,
      descricaoDetalhada: null,
    },
    {
        id: 3,
        causa: 'Cestas Básicas para Famílias',
        valor: 100.00,
        data: '2024-03-01',
        status: 'Confirmada',
        comprovante: true,
        descricaoDetalhada: 'aquisição de alimentos para 5 famílias.',
      },
  ];
  beforeEach(() => {
    axios.get.mockClear();
    mockUseAuth.mockClear();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    mockUseAuth.mockReturnValue({
      user: { role: 'apoiador', id: 'apoiador123' },
      token: 'mock-token',
      isAuthenticated: () => true,
    });
  });
  afterEach(() => {
    consoleErrorSpy.mockRestore();
    alertSpy.mockRestore();
  });
  test('deve exibir "Carregando histórico de doações..." enquanto os dados estão sendo buscados', () => {
    axios.get.mockImplementationOnce(() => new Promise(() => {})); 
    render(<ComprovantesPerfil />);
    expect(screen.getByRole('status')).toBeInTheDocument(); 
    expect(screen.getByText(/Carregando histórico de doações.../i)).toBeInTheDocument();
  });
  test('deve exibir "Acesso negado" se o usuário não estiver logado', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: () => false,
      user: null,
      token: null,
    });
    render(<ComprovantesPerfil />);
    await waitFor(() => {
      expect(screen.getByText(/Acesso negado. Esta seção é exclusiva para apoiadores logados./i)).toBeInTheDocument();
    });
    expect(axios.get).not.toHaveBeenCalled(); 
  });
  test('deve exibir "Acesso negado" se o usuário for aluno', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: () => true,
      user: { role: 'aluno', id: 'aluno123' },
      token: 'mock-token',
    });
    render(<ComprovantesPerfil />);
    await waitFor(() => {
      expect(screen.getByText(/Acesso negado. Esta seção é exclusiva para apoiadores logados./i)).toBeInTheDocument();
    });
    expect(axios.get).not.toHaveBeenCalled(); 
  });
  test('deve exibir mensagem de erro se a busca de histórico falhar', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error')); 
    render(<ComprovantesPerfil />);
    await waitFor(() => {
      expect(screen.getByText(/Falha ao carregar seu histórico de doações. Tente novamente mais tarde./i)).toBeInTheDocument();
    });
    expect(consoleErrorSpy).toHaveBeenCalled(); 
  });
  test('deve exibir "Você ainda não realizou nenhuma doação." se não houver histórico', async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); 
    render(<ComprovantesPerfil />);
    await waitFor(() => {
      expect(screen.getByText(/Você ainda não realizou nenhuma doação./i)).toBeInTheDocument();
    });
    expect(screen.queryByRole('table')).not.toBeInTheDocument(); 
  });
  test('deve renderizar o histórico de doações em tabela quando os dados são carregados com sucesso', async () => {
    axios.get.mockResolvedValueOnce({ data: mockDoacoesApoiador }); 
    render(<ComprovantesPerfil />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Histórico de Doações/i })).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
    expect(screen.getByRole('columnheader', { name: /Causa/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Valor/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Data/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Ações/i })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Alfabetização Infantil' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'R$ 150.00' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '2024-05-10' })).toBeInTheDocument();
    expect(screen.getByText('Confirmada')).toBeInTheDocument(); 
    expect(screen.getByRole('button', { name: 'Detalhes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Comprovante/i })).toBeInTheDocument(); 
    expect(screen.getByRole('cell', { name: 'Campanha de Agasalhos' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'R$ 200.50' })).toBeInTheDocument();
    expect(screen.getByText('Pendente')).toBeInTheDocument(); 
    const comprovanteButtonCausa2 = screen.queryByRole('button', { name: /Comprovante/i });
    expect(comprovanteButtonCausa2).not.toBeInTheDocument();
  });
  test('deve filtrar as doações por termo de busca na causa', async () => {
    axios.get.mockResolvedValueOnce({ data: mockDoacoesApoiador });
    render(<ComprovantesPerfil />);
    await waitFor(() => {
      expect(screen.getByText('Alfabetização Infantil')).toBeInTheDocument();
    });
    const searchInput = screen.getByPlaceholderText(/Buscar doação.../i);
    fireEvent.change(searchInput, { target: { value: 'alfab' } });
    expect(screen.getByText('Alfabetização Infantil')).toBeInTheDocument();
    expect(screen.queryByText('Campanha de Agasalhos')).not.toBeInTheDocument(); 
    expect(screen.queryByText('Cestas Básicas para Famílias')).not.toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: '' } });
    await waitFor(() => {
      expect(screen.getByText('Campanha de Agasalhos')).toBeInTheDocument(); 
    });
  });
  test('deve abrir e fechar o modal de detalhes da doação', async () => {
    axios.get.mockResolvedValueOnce({ data: mockDoacoesApoiador });
    render(<ComprovantesPerfil />);
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
    const detalhesButton = screen.getAllByRole('button', { name: 'Detalhes' })[0];
    fireEvent.click(detalhesButton);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Detalhes da Doação/i })).toBeInTheDocument();
      expect(screen.getByText('Alfabetização Infantil')).toBeInTheDocument();
      expect(screen.getByText('R$ 150.00')).toBeInTheDocument();
    });
    const fecharButton = screen.getByRole('button', { name: 'Fechar' });
    fireEvent.click(fecharButton);
    await waitFor(() => {
      expect(screen.queryByText(/Detalhes da Doação/i)).not.toBeInTheDocument();
    });
  });
  test('deve chamar o alert de download ao clicar no botão "Baixar Comprovante" no modal', async () => {
    axios.get.mockResolvedValueOnce({ data: mockDoacoesApoiador });
    render(<ComprovantesPerfil />);
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
    const detalhesButton = screen.getAllByRole('button', { name: 'Detalhes' })[0];
    fireEvent.click(detalhesButton);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Detalhes da Doação/i })).toBeInTheDocument();
    });
    const downloadButtonModal = screen.getByRole('button', { name: /Baixar Comprovante/i });
    fireEvent.click(downloadButtonModal);
    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith("Funcionalidade de download de comprovante ainda não implementada.");
    expect(screen.getByRole('heading', { name: /Detalhes da Doação/i })).toBeInTheDocument();
  });
  test('deve chamar o alert de download ao clicar no botão "Comprovante" na tabela', async () => {
    axios.get.mockResolvedValueOnce({ data: mockDoacoesApoiador });
    render(<ComprovantesPerfil />);
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
    const comprovanteButtonTabela = screen.getAllByRole('button', { name: /Comprovante/i })[0];
    fireEvent.click(comprovanteButtonTabela);
    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith("Funcionalidade de download de comprovante ainda não implementada.");
  });
});