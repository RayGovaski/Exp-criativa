import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Doacoes from '../comp_home/Doacoes'; 
jest.mock('../comp_home/Doacoes.css', () => ({})); 
import { MemoryRouter } from 'react-router-dom';
const mockNavigate = jest.fn(); 
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ to, children }) => <a href={to}>{children}</a>, 
  useNavigate: () => mockNavigate, 
  MemoryRouter: ({ children }) => <>{children}</>,
}));
import axios from 'axios';
jest.mock('axios'); 
describe('Doacoes', () => {
  let consoleErrorSpy;
  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockClear(); 
  });
  afterEach(() => {
    consoleErrorSpy.mockRestore(); 
  });
  test('deve exibir "Carregando doações..." enquanto os dados estão sendo buscados', () => {
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    render(<Doacoes />);
    expect(screen.getByText(/Carregando doações.../i)).toBeInTheDocument();
    expect(screen.queryByText(/Nenhuma doação disponível no momento./i)).not.toBeInTheDocument();
  });
  test('deve exibir mensagem de erro quando a busca de doações falha', async () => {
    const errorMessage = "Não foi possível carregar as doações. Tente novamente mais tarde.";
    axios.get.mockRejectedValueOnce(new Error('Network error'));
    render(<Doacoes />);
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Carregando doações.../i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Nenhuma doação disponível no momento./i)).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled(); 
  });
  test('deve exibir "Nenhuma doação disponível no momento." quando a API retorna lista vazia', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<Doacoes />);
    await waitFor(() => {
      expect(screen.getByText(/Nenhuma doação disponível no momento./i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Carregando doações.../i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Doar para uma causa/i)).not.toBeInTheDocument(); 
  });
  test('deve renderizar os cards de doação quando a API retorna dados', async () => {
    const mockDoacoesData = [
      {
        id: 1,
        titulo: 'Doação para Roupas',
        descricao: 'Ajude com roupas para o inverno.',
        imagem_path: 'caminho/roupas.jpg',
        porcentagem: 75,
        valorMeta: 1000,
        arrecadado: 750,
        status: 'Ativa',
        prioridade: 'Alta',
      },
      {
        id: 2,
        titulo: 'Doação para Alimentos',
        descricao: 'Comida para famílias carentes.',
        imagem_path: null, 
        porcentagem: 30,
        valorMeta: 2000,
        arrecadado: 600,
        status: 'Ativa',
        prioridade: 'Média',
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockDoacoesData });
    render(<Doacoes />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Doar para uma causa/i })).toBeInTheDocument();
    });
    expect(screen.getByText('Doação para Roupas')).toBeInTheDocument();
    expect(screen.getByText('Ajude com roupas para o inverno.')).toBeInTheDocument();
    expect(screen.getByText('Doação para Alimentos')).toBeInTheDocument();
    expect(screen.getByText('Comida para famílias carentes.')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', 'http:
    expect(images[1]).toHaveAttribute('src', 'https:
  });
  test('o botão "Veja Mais Onde Voce Pode Ajudar!" deve navegar para /doar', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 1, titulo: 'Teste', descricao: 'Teste', porcentagem: 50 }] });
    render(<Doacoes />);
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Veja Mais Onde Voce Pode Ajudar!/i })).toBeInTheDocument();
    });
    const vejaMaisLink = screen.getByRole('link', { name: /Veja Mais Onde Voce Pode Ajudar!/i });
    expect(vejaMaisLink).toHaveAttribute('href', '/doar');
  });
});