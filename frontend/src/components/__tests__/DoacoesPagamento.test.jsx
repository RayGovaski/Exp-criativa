import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import DoacoesPagamento from '../../pages/compra-assinatura/DoacoesPagamento'; 
jest.mock('../../pages/compra-assinatura/DoacoesPagamento.css', () => ({}));
jest.mock('lucide-react', () => ({
  CreditCard: () => <svg data-testid="icon-creditcard" />,
  Smartphone: () => <svg data-testid="icon-smartphone" />,
  FileText: () => <svg data-testid="icon-filetext" />,
}));
import axios from 'axios';
jest.mock('axios');
import { MemoryRouter, useLocation } from 'react-router-dom';
const mockNavigate = jest.fn();
const mockUseLocation = jest.fn(); 
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation(), 
  MemoryRouter: ({ children }) => <>{children}</>,
}));
const mockUseAuth = jest.fn();
jest.mock('src/context/AuthContext', () => ({ 
  useAuth: () => mockUseAuth(),
}));
describe('DoacoesPagamento', () => {
  let consoleErrorSpy;
  let alertSpy;
  let setTimeoutSpy; 
  const mockProjectData = {
    id: 1,
    titulo: 'Doação para Material Escolar',
    descricao: 'Ajude a comprar materiais para nossos alunos.',
    porcentagem: 50,
    arrecadado: 2500,
    valorMeta: 5000,
    imagem_path: 'url/imagem.jpg',
  };
  beforeEach(() => {
    axios.get.mockClear();
    axios.post.mockClear();
    mockNavigate.mockClear();
    mockUseAuth.mockClear();
    mockUseLocation.mockClear();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((fn) => fn()); 
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: () => false,
    });
    mockUseLocation.mockReturnValue({ state: { preSelectedCauseId: mockProjectData.id } });
    axios.get.mockResolvedValueOnce({ data: mockProjectData }); 
  });
  afterEach(() => {
    consoleErrorSpy.mockRestore();
    alertSpy.mockRestore();
    setTimeoutSpy.mockRestore(); 
  });
  test('deve redirecionar para /doar se nenhum projeto for selecionado (preSelectedCauseId ausente)', async () => {
    mockUseLocation.mockReturnValue({ state: null }); 
    render(<DoacoesPagamento />);
    expect(screen.getByText(/Nenhum projeto de doação selecionado. Redirecionando.../i)).toBeInTheDocument();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/doar');
    });
    expect(axios.get).not.toHaveBeenCalled(); 
  });
  test('deve carregar e exibir os detalhes do projeto selecionado', async () => {
    render(<DoacoesPagamento />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: `Faça sua Doação para "${mockProjectData.titulo}"` })).toBeInTheDocument();
      expect(screen.getByText(`Projeto: ${mockProjectData.titulo}`)).toBeInTheDocument();
      expect(screen.getByText(mockProjectData.descricao)).toBeInTheDocument();
      expect(screen.getByText(`${mockProjectData.arrecadado.toFixed(2).replace('.', ',')} / ${mockProjectData.valorMeta.toFixed(2).replace('.', ',')} (Meta: ${mockProjectData.porcentagem}%)`)).toBeInTheDocument();
    });
    expect(axios.get).toHaveBeenCalledWith(`http:
  });
  test('deve exibir mensagem de erro se a busca de detalhes do projeto falhar', async () => {
    axios.get.mockRejectedValueOnce(new Error('Falha na API')); 
    render(<DoacoesPagamento />);
    await waitFor(() => {
      expect(screen.getByText(/Erro ao carregar detalhes do projeto. Tente novamente./i)).toBeInTheDocument();
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Erro ao buscar detalhes do projeto:", expect.any(Error));
  });
  test('deve permitir a entrada de valor de doação e formatá-lo', async () => {
    render(<DoacoesPagamento />);
    await waitFor(() => {  });
    const donationAmountInput = screen.getByPlaceholderText('0,00');
    fireEvent.change(donationAmountInput, { target: { value: '100,50' } });
    expect(donationAmountInput).toHaveValue('100.50'); 
    expect(screen.getByRole('heading', { name: /Método de Pagamento/i })).toBeInTheDocument();
  });
  test('deve exibir campos de cartão ao selecionar Cartão de Crédito', async () => {
    render(<DoacoesPagamento />);
    await waitFor(() => {  });
    fireEvent.change(screen.getByPlaceholderText('0,00'), { target: { value: '50' } }); 
    fireEvent.click(screen.getByText('Cartão de Crédito').closest('.payment-method-card')); 
    await waitFor(() => {
      expect(screen.getByLabelText(/Número do Cartão \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Nome no Cartão \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Validade \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/CVV \*/i)).toBeInTheDocument();
    });
  });
  test('deve exibir mensagem de QR Code ao selecionar Pix', async () => {
    render(<DoacoesPagamento />);
    await waitFor(() => {  });
    fireEvent.change(screen.getByPlaceholderText('0,00'), { target: { value: '50' } });
    fireEvent.click(screen.getByText('Pix').closest('.payment-method-card'));
    await waitFor(() => {
      expect(screen.getByText(/QR Code será gerado/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Número do Cartão/i)).not.toBeInTheDocument();
    });
  });
  test('deve exibir formulário de dados do cliente se o usuário não estiver logado', async () => {
    render(<DoacoesPagamento />);
    await waitFor(() => {  });
    fireEvent.change(screen.getByPlaceholderText('0,00'), { target: { value: '50' } });
    fireEvent.click(screen.getByText('Cartão de Crédito').closest('.payment-method-card'));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Seus Dados/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Nome Completo \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/E-mail \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    });
  });
  test('não deve exibir formulário de dados do cliente se o usuário estiver logado', async () => {
    setupLoggedInApoiador(); 
    render(<DoacoesPagamento />);
    await waitFor(() => {  });
    fireEvent.change(screen.getByPlaceholderText('0,00'), { target: { value: '50' } });
    fireEvent.click(screen.getByText('Cartão de Crédito').closest('.payment-method-card'));
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Seus Dados/i })).not.toBeInTheDocument();
    });
  });
  test('deve processar doação via Pix para usuário não logado', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Doação recebida com sucesso!' } }); 
    render(<DoacoesPagamento />);
    await waitFor(() => {  });
    fireEvent.change(screen.getByPlaceholderText('0,00'), { target: { value: '75.50' } });
    fireEvent.click(screen.getByText('Pix').closest('.payment-method-card'));
    fireEvent.change(screen.getByLabelText(/Nome Completo \*/i), { target: { value: 'Doador Visitante' } });
    fireEvent.change(screen.getByLabelText(/E-mail \*/i), { target: { value: 'doador@example.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11987654321' } });
    const confirmButton = screen.getByRole('button', { name: /Confirmar Doação/i });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('http:
        doacaoId: mockProjectData.id,
        valorDoado: 75.50,
        customerName: 'Doador Visitante',
        customerEmail: 'doador@example.com',
        customerPhone: '11987654321',
        metodoPagamento: 'pix',
      }, { headers: { 'Content-Type': 'application/json' } }); 
      expect(alertSpy).toHaveBeenCalledWith('Doação recebida com sucesso!');
      expect(mockNavigate).toHaveBeenCalledWith('/doar');
    });
  });
  test('deve processar doação via Cartão de Crédito para usuário logado', async () => {
    setupLoggedInApoiador(); 
    axios.post.mockResolvedValueOnce({ data: { message: 'Doação processada com sucesso!' } });
    render(<DoacoesPagamento />);
    await waitFor(() => {  });
    fireEvent.change(screen.getByPlaceholderText('0,00'), { target: { value: '150.00' } });
    fireEvent.click(screen.getByText('Cartão de Crédito').closest('.payment-method-card'));
    fireEvent.change(screen.getByLabelText(/Número do Cartão \*/i), { target: { value: '1111222233334444' } });
    fireEvent.change(screen.getByLabelText(/Nome no Cartão \*/i), { target: { value: 'APOIADOR TESTE' } });
    fireEvent.change(screen.getByLabelText(/Validade \*/i), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText(/CVV \*/i), { target: { value: '123' } });
    const confirmButton = screen.getByRole('button', { name: /Confirmar Doação/i });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('http:
        doacaoId: mockProjectData.id,
        valorDoado: 150.00,
        cardNumber: '1111222233334444',
        cardName: 'APOIADOR TESTE',
        cardExpiry: '12/25',
        cardCvv: '123',
        metodoPagamento: 'credit',
      }, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test-token' } }); 
      expect(alertSpy).toHaveBeenCalledWith('Doação processada com sucesso!');
      expect(mockNavigate).toHaveBeenCalledWith('/doar');
    });
  });
  test('deve exibir alerta se valor de doação for inválido ou método/dados ausentes', async () => {
    render(<DoacoesPagamento />);
    await waitFor(() => {  });
    const donationAmountInput = screen.getByPlaceholderText('0,00');
    const confirmButton = screen.getByRole('button', { name: /Confirmar Doação/i });
    fireEvent.click(confirmButton);
    expect(alertSpy).toHaveBeenCalledWith('Por favor, insira um valor de doação válido e selecione um método de pagamento.');
    alertSpy.mockClear();
    fireEvent.change(donationAmountInput, { target: { value: '0' } });
    fireEvent.click(confirmButton);
    expect(alertSpy).toHaveBeenCalledWith('Por favor, insira um valor de doação válido e selecione um método de pagamento.');
    alertSpy.mockClear();
    fireEvent.change(donationAmountInput, { target: { value: '10' } });
    fireEvent.click(confirmButton);
    expect(alertSpy).toHaveBeenCalledWith('Por favor, selecione um plano e método de pagamento.'); 
    expect(axios.post).not.toHaveBeenCalled();
  });
  test('deve exibir alerta se dados do cliente estiverem incompletos (para não logados)', async () => {
    render(<DoacoesPagamento />); 
    await waitFor(() => {  });
    fireEvent.change(screen.getByPlaceholderText('0,00'), { target: { value: '20' } });
    fireEvent.click(screen.getByText('Pix').closest('.payment-method-card'));
    const nameInput = screen.getByLabelText(/Nome Completo \*/i);
    const emailInput = screen.getByLabelText(/E-mail \*/i);
    const confirmButton = screen.getByRole('button', { name: /Confirmar Doação/i });
    fireEvent.change(nameInput, { target: { value: 'Nome Incompleto' } });
    fireEvent.click(confirmButton);
    expect(alertSpy).toHaveBeenCalledWith('Por favor, preencha seus dados (Nome, Email, Telefone) para continuar.');
    alertSpy.mockClear();
    fireEvent.change(emailInput, { target: { value: 'teste@email.com' } });
    fireEvent.click(confirmButton);
    expect(axios.post).not.toHaveBeenCalled();
  });
  test('deve exibir alerta se dados de cartão estiverem incompletos', async () => {
    render(<DoacoesPagamento />);
    await waitFor(() => {  });
    fireEvent.change(screen.getByPlaceholderText('0,00'), { target: { value: '30' } });
    fireEvent.click(screen.getByText('Cartão de Débito').closest('.payment-method-card'));
    const cardNumberInput = screen.getByLabelText(/Número do Cartão \*/i);
    const confirmButton = screen.getByRole('button', { name: /Confirmar Doação/i });
    fireEvent.click(confirmButton);
    expect(alertSpy).toHaveBeenCalledWith('Por favor, preencha todos os dados do cartão.');
    expect(axios.post).not.toHaveBeenCalled();
  });
  test('deve exibir alerta de erro e não redirecionar se a doação falhar na API', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { error: 'Falha no processamento da doação.' } } });
    render(<DoacoesPagamento />);
    await waitFor(() => {  });
    fireEvent.change(screen.getByPlaceholderText('0,00'), { target: { value: '40' } });
    fireEvent.click(screen.getByText('Pix').closest('.payment-method-card'));
    fireEvent.change(screen.getByLabelText(/Nome Completo \*/i), { target: { value: 'Doador Erro' } });
    fireEvent.change(screen.getByLabelText(/E-mail \*/i), { target: { value: 'erro@example.com' } });
    const confirmButton = screen.getByRole('button', { name: /Confirmar Doação/i });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Falha no processamento da doação.');
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});