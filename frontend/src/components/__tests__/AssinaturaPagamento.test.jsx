import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import AssinaturaPagamento from '../../pages/compra-assinatura/Assinaturapagamento';

jest.mock('../../pages/compra-assinatura/AssinaturaPagamento.css', () => ({}));

jest.mock('lucide-react', () => ({
  CreditCard: () => <svg data-testid="icon-creditcard" />,
  Smartphone: () => <svg data-testid="icon-smartphone" />,
  FileText: () => <svg data-testid="icon-filetext" />,
  Building: () => <svg data-testid="icon-building" />,
}));

import axios from 'axios';
jest.mock('axios');

import { MemoryRouter } from 'react-router-dom';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  MemoryRouter: ({ children }) => <>{children}</>,
}));

const mockUseAuth = jest.fn();
jest.mock('src/context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('AssinaturaPagamento', () => {
  let consoleErrorSpy;
  let alertSpy;
  let confirmSpy;

  const plans = [
    { id: 'semente', dbId: 1, title: "Plano Semente", subtitle: "(Toda ajuda faz a diferença!)", price: "R$ 20/mês", numericPrice: 20, description: "...", highlightColor: "selected-plan-border-blue" },
    { id: 'melodia', dbId: 2, title: "Plano Melodia", subtitle: "(Dando voz ao futuro!)", price: "R$ 50/mês", numericPrice: 50, description: "...", highlightColor: "selected-plan-border-cyan" },
    { id: 'palco', dbId: 3, title: "Plano Palco", subtitle: "(A arte que muda vidas!)", price: "R$ 100/mês", numericPrice: 100, description: "...", highlightColor: "selected-plan-border-blue" },
    { id: 'estrela', dbId: 4, title: "Plano Estrela", subtitle: "(Transformando futuros!)", price: "R$ 200/mês", numericPrice: 200, description: "...", highlightColor: "selected-plan-border-cyan" },
  ];

  beforeEach(() => {
    axios.get.mockClear();
    axios.post.mockClear();
    mockNavigate.mockClear();
    mockUseAuth.mockClear();

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    alertSpy.mockRestore();
    confirmSpy.mockRestore();
  });

  const setupLoggedInApoiador = (token = 'test-token', userRole = 'apoiador', userId = 'apoiador123') => {
    mockUseAuth.mockReturnValue({
      user: { id: userId, role: userRole },
      token: token,
      isAuthenticated: () => true,
    });
  };

  test('deve redirecionar para /login se não houver token ao carregar', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: () => false,
    });

    render(<AssinaturaPagamento />);

    expect(screen.getByText(/Carregando ou redirecionando para o login.../i)).toBeInTheDocument();

    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('deve buscar e exibir o plano atual do usuário se houver', async () => {
    setupLoggedInApoiador();
    axios.get.mockResolvedValueOnce({ data: { plano_nome: 'Plano Semente', plano_preco: 20 } });

    render(<AssinaturaPagamento />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/apoiador/profile', {
        headers: { Authorization: 'Bearer test-token' }
      });
      expect(screen.getByText(/Você está atualmente no plano/i)).toBeInTheDocument();
      expect(screen.getByText('Plano Semente')).toBeInTheDocument();
    });
  });

  test('não deve exibir mensagem de plano atual se não houver plano ativo', async () => {
    setupLoggedInApoiador();
    axios.get.mockResolvedValueOnce({ data: { plano_nome: null } });

    render(<AssinaturaPagamento />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/apoiador/profile', {
        headers: { Authorization: 'Bearer test-token' }
      });
      expect(screen.queryByText(/Você está atualmente no plano/i)).not.toBeInTheDocument();
    });
  });

  test('deve lidar com erro ao buscar plano atual', async () => {
    setupLoggedInApoiador();
    axios.get.mockRejectedValueOnce(new Error('Erro de rede'));

    render(<AssinaturaPagamento />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/apoiador/profile', {
        headers: { Authorization: 'Bearer test-token' }
      });
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Erro ao buscar plano atual:", expect.any(Error));
    expect(screen.queryByText(/Você está atualmente no plano/i)).not.toBeInTheDocument();
  });

  test('deve permitir a seleção de um plano', async () => {
    setupLoggedInApoiador();
    axios.get.mockResolvedValueOnce({ data: {} });
    render(<AssinaturaPagamento />);
    await waitFor(() => { });

    const planoSementeCard = screen.getByText('Plano Semente').closest('div');
    fireEvent.click(planoSementeCard);

    expect(planoSementeCard).toHaveClass('selected-plan-border-blue');
    expect(screen.getByRole('radio', { name: /Plano Semente/i })).toBeChecked();

    expect(screen.getByRole('heading', { name: /Método de Pagamento/i })).toBeInTheDocument();
  });

  test('deve exibir campos de cartão ao selecionar Cartão de Crédito', async () => {
    setupLoggedInApoiador();
    axios.get.mockResolvedValueOnce({ data: {} });
    render(<AssinaturaPagamento />);
    await waitFor(() => { });

    fireEvent.click(screen.getByText('Plano Semente').closest('div'));

    const creditCardMethod = screen.getByText('Cartão de Crédito').closest('div');
    fireEvent.click(creditCardMethod);

    await waitFor(() => {
      expect(screen.getByLabelText(/Número do Cartão \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Nome no Cartão \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Validade \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/CVV \*/i)).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem de QR Code ao selecionar Pix', async () => {
    setupLoggedInApoiador();
    axios.get.mockResolvedValueOnce({ data: {} });
    render(<AssinaturaPagamento />);
    await waitFor(() => { });

    fireEvent.click(screen.getByText('Plano Semente').closest('div'));
    fireEvent.click(screen.getByText('Pix').closest('div'));

    await waitFor(() => {
      expect(screen.getByText(/QR Code será gerado/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Número do Cartão/i)).not.toBeInTheDocument();
    });
  });

  test('deve permitir preencher os dados do cartão', async () => {
    setupLoggedInApoiador();
    axios.get.mockResolvedValueOnce({ data: {} });
    render(<AssinaturaPagamento />);
    await waitFor(() => { });

    fireEvent.click(screen.getByText('Plano Semente').closest('div'));
    fireEvent.click(screen.getByText('Cartão de Crédito').closest('div'));

    const cardNumberInput = screen.getByLabelText(/Número do Cartão \*/i);
    const cardNameInput = screen.getByLabelText(/Nome no Cartão \*/i);
    const cardExpiryInput = screen.getByLabelText(/Validade \*/i);
    const cardCvvInput = screen.getByLabelText(/CVV \*/i);

    fireEvent.change(cardNumberInput, { target: { value: '1111222233334444' } });
    fireEvent.change(cardNameInput, { target: { value: 'FULANO DE TAL' } });
    fireEvent.change(cardExpiryInput, { target: { value: '12/25' } });
    fireEvent.change(cardCvvInput, { target: { value: '123' } });

    expect(cardNumberInput).toHaveValue('1111222233334444');
    expect(cardNameInput).toHaveValue('FULANO DE TAL');
    expect(cardExpiryInput).toHaveValue('12/25');
    expect(cardCvvInput).toHaveValue('123');
  });

  test('deve chamar a API de assinatura e redirecionar para o perfil em caso de nova assinatura bem-sucedida', async () => {
    setupLoggedInApoiador();
    axios.get.mockResolvedValueOnce({ data: { plano_nome: null } });
    axios.post.mockResolvedValueOnce({ data: { message: 'Assinatura criada com sucesso!' } });

    render(<AssinaturaPagamento />);
    await waitFor(() => { });

    fireEvent.click(screen.getByText('Plano Melodia').closest('div'));
    fireEvent.click(screen.getByText('Pix').closest('div'));

    const confirmButton = screen.getByRole('button', { name: /Confirmar Assinatura/i });
    fireEvent.click(confirmButton);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/apoiador/assinar-plano', {
      apoiadorId: 'apoiador123',
      planoId: 2,
    }, {
      headers: { Authorization: 'Bearer test-token' }
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy).toHaveBeenCalledWith('Assinatura criada com sucesso!');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/perfil');
    });
  });

  test('deve perguntar e confirmar a troca de plano e chamar a API', async () => {
    setupLoggedInApoiador();
    axios.get.mockResolvedValueOnce({ data: { plano_nome: 'Plano Semente', plano_preco: 20 } });
    axios.post.mockResolvedValueOnce({ data: { message: 'Plano atualizado com sucesso!' } });
    confirmSpy.mockImplementationOnce(() => true);

    render(<AssinaturaPagamento />);
    await waitFor(() => { });

    fireEvent.click(screen.getByText('Plano Palco').closest('div'));
    fireEvent.click(screen.getByText('Boleto').closest('div'));

    const confirmButton = screen.getByRole('button', { name: /Confirmar Assinatura/i });
    fireEvent.click(confirmButton);

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(confirmSpy).toHaveBeenCalledWith(
        "Você já possui o plano Plano Semente. Deseja trocar para o plano Plano Palco?"
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/apoiador/assinar-plano', {
        apoiadorId: 'apoiador123',
        planoId: 3,
      }, {
        headers: { Authorization: 'Bearer test-token' }
      });
      expect(alertSpy).toHaveBeenCalledWith('Plano atualizado com sucesso!');
      expect(mockNavigate).toHaveBeenCalledWith('/perfil');
    });
  });

  test('não deve chamar a API se o usuário cancelar a troca de plano', async () => {
    setupLoggedInApoiador();
    axios.get.mockResolvedValueOnce({ data: { plano_nome: 'Plano Semente', plano_preco: 20 } });
    confirmSpy.mockImplementationOnce(() => false);

    render(<AssinaturaPagamento />);
    await waitFor(() => { });

    fireEvent.click(screen.getByText('Plano Palco').closest('div'));
    fireEvent.click(screen.getByText('Boleto').closest('div'));

    const confirmButton = screen.getByRole('button', { name: /Confirmar Assinatura/i });
    fireEvent.click(confirmButton);

    expect(confirmSpy).toHaveBeenCalledTimes(1);
    expect(axios.post).not.toHaveBeenCalled();
    expect(alertSpy).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('deve exibir alerta e não chamar API se o plano selecionado já for o plano atual', async () => {
    setupLoggedInApoiador();
    axios.get.mockResolvedValueOnce({ data: { plano_nome: 'Plano Melodia', plano_preco: 50 } });

    render(<AssinaturaPagamento />);
    await waitFor(() => { });

    fireEvent.click(screen.getByText('Plano Melodia').closest('div'));
    fireEvent.click(screen.getByText('Pix').closest('div'));

    const confirmButton = screen.getByRole('button', { name: /Confirmar Assinatura/i });
    fireEvent.click(confirmButton);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith('Você já está atualmente no plano Plano Melodia.');
    expect(axios.post).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('deve exibir alerta se nenhum plano ou método de pagamento for selecionado', async () => {
    setupLoggedInApoiador();
    axios.get.mockResolvedValueOnce({ data: {} });
    render(<AssinaturaPagamento />);
    await waitFor(() => { });

    const confirmButton = screen.getByRole('button', { name: /Confirmar Assinatura/i });

    fireEvent.click(confirmButton);
    expect(alertSpy).toHaveBeenCalledWith('Por favor, selecione um plano e método de pagamento.');
    alertSpy.mockClear();

    fireEvent.click(screen.getByText('Plano Semente').closest('div'));
    fireEvent.click(confirmButton);
    expect(alertSpy).toHaveBeenCalledWith('Por favor, selecione um plano e método de pagamento.');
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('deve exibir alerta se dados de cartão estiverem incompletos', async () => {
    setupLoggedInApoiador();
    axios.get.mockResolvedValueOnce({ data: {} });
    render(<AssinaturaPagamento />);
    await waitFor(() => { });

    fireEvent.click(screen.getByText('Plano Semente').closest('div'));
    fireEvent.click(screen.getByText('Cartão de Crédito').closest('div'));

    const cardNumberInput = screen.getByLabelText(/Número do Cartão \*/i);
    const cardNameInput = screen.getByLabelText(/Nome no Cartão \*/i);
    const confirmButton = screen.getByRole('button', { name: /Confirmar Assinatura/i });

    fireEvent.change(cardNumberInput, { target: { value: '1111' } });
    fireEvent.click(confirmButton);
    expect(alertSpy).toHaveBeenCalledWith('Por favor, preencha todos os dados do cartão.');
    expect(alertSpy).toHaveBeenCalledTimes(1);
    alertSpy.mockClear();

    fireEvent.change(cardNameInput, { target: { value: 'TESTE' } });
    fireEvent.click(confirmButton);
    expect(alertSpy).toHaveBeenCalledWith('Por favor, preencha todos os dados do cartão.');
    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('deve exibir alerta de erro e não redirecionar se a chamada de assinatura falhar', async () => {
    setupLoggedInApoiador();
    axios.get.mockResolvedValueOnce({ data: {} });
    axios.post.mockRejectedValueOnce({ response: { data: { error: 'Falha no processamento do pagamento.' } } });

    render(<AssinaturaPagamento />);
    await waitFor(() => { });

    fireEvent.click(screen.getByText('Plano Semente').closest('div'));
    fireEvent.click(screen.getByText('Pix').closest('div'));

    const confirmButton = screen.getByRole('button', { name: /Confirmar Assinatura/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy).toHaveBeenCalledWith('Falha no processamento do pagamento.');
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  test('deve exibir alerta e redirecionar para /login se o user.id estiver ausente', async () => {
    setupLoggedInApoiador('test-token', 'apoiador', null);
    axios.get.mockResolvedValueOnce({ data: {} });
    render(<AssinaturaPagamento />);
    await waitFor(() => { });

    fireEvent.click(screen.getByText('Plano Semente').closest('div'));
    fireEvent.click(screen.getByText('Pix').closest('div'));

    const confirmButton = screen.getByRole('button', { name: /Confirmar Assinatura/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy).toHaveBeenCalledWith('Erro: ID do apoiador não encontrado. Por favor, faça login novamente.');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(axios.post).not.toHaveBeenCalled();
    });
  });
});