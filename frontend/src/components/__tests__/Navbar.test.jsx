import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '../../components/navbar/Navbar'; 
import { MemoryRouter } from 'react-router-dom';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), 
  useNavigate: () => mockNavigate,           
  MemoryRouter: ({ children }) => <>{children}</>, 
}));
jest.mock('react-router-hash-link', () => ({
  HashLink: ({ to, children, onClick, ...rest }) => (
    <a href={to} onClick={onClick} {...rest}>
      {children}
    </a>
  ),
}));
const mockLogout = jest.fn();
const mockUseAuth = jest.fn(); 
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(), 
}));
describe('Navbar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogout.mockClear();
    mockUseAuth.mockClear();
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('quando o usuário NÃO está logado', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: () => false, 
        user: null,
        logout: mockLogout,
      });
    });
    test('deve renderizar links de Login e Registro no desktop', () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
      expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Registro/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /Meu Perfil/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Sair/i })).not.toBeInTheDocument();
    });
    test('deve renderizar links de Login e Registro no sidebar (mobile)', async () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 }); 
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
      const toggler = screen.getByRole('button', { name: /Toggle navigation/i });
      fireEvent.click(toggler);
      await waitFor(() => {
        expect(screen.getByRole('link', { name: /Login/i, selector: '.sidebar-link' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Registro/i, selector: '.sidebar-link' })).toBeInTheDocument();
      });
    });
    test('o link de Registro deve navegar para /menu-registro', () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
      const registroLink = screen.getByRole('link', { name: /Registro/i });
      expect(registroLink).toHaveAttribute('href', '/menu-registro');
    });
    test('o link de Login deve navegar para /login', () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
      const loginLink = screen.getByRole('link', { name: /Login/i });
      expect(loginLink).toHaveAttribute('href', '/login');
    });
    test('o dropdown "Apoie" deve mostrar "Doar para causa" e não "Assinaturas" (dropdown desktop)', async () => {
        render(<MemoryRouter><Navbar /></MemoryRouter>);
        const apoieDropdownToggle = screen.getByText(/Apoie/i); 
        fireEvent.click(apoieDropdownToggle);
        await waitFor(() => {
            expect(screen.getByRole('link', { name: /Doar para causa/i })).toBeInTheDocument();
            expect(screen.queryByRole('link', { name: /Assinaturas/i })).not.toBeInTheDocument();
        });
        const doarLink = screen.getByRole('link', { name: /Doar para causa/i });
        expect(doarLink).toHaveAttribute('href', '/doar');
    });
    test('o dropdown "Apoie" deve mostrar "Doar para causa" e não "Assinaturas" (dropdown sidebar)', async () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 });
      render(<MemoryRouter><Navbar /></MemoryRouter>);
      const toggler = screen.getByRole('button', { name: /Toggle navigation/i });
      fireEvent.click(toggler); 
      const apoieDropdownToggle = screen.getByText(/Apoie/i, { selector: '.sidebar-link.dropdown-toggle' });
      fireEvent.click(apoieDropdownToggle); 
      await waitFor(() => {
          expect(screen.getByRole('link', { name: /Doar para causa/i, selector: '.sidebar-dropdown-item' })).toBeInTheDocument();
          expect(screen.queryByRole('link', { name: /Assinaturas/i, selector: '.sidebar-dropdown-item' })).not.toBeInTheDocument();
      });
      const doarLink = screen.getByRole('link', { name: /Doar para causa/i, selector: '.sidebar-dropdown-item' });
      expect(doarLink).toHaveAttribute('href', '/doar');
    });
  });
  describe('quando o usuário ESTÁ logado', () => {
    const commonUser = { id: 'testId123', role: 'apoiador', name: 'Apoio', foto_path: '/path/to/apoiador.jpg' }; 
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: () => true,
        user: commonUser,
        logout: mockLogout,
      });
      global.URL.createObjectURL = jest.fn(() => 'mock-image-url.jpg');
    });
    afterEach(() => {
        global.URL.createObjectURL.mockRestore();
    });
    test('deve renderizar a imagem de perfil e o botão "Sair"', () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
      expect(screen.getByAltText('Perfil')).toBeInTheDocument();
      expect(screen.getByAltText('Perfil').src).toContain('mock-image-url.jpg'); 
      expect(screen.queryByRole('link', { name: /Login/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /Registro/i })).not.toBeInTheDocument();
    });
    test('o clique na imagem de perfil deve exibir o dropdown e o link "Meu Perfil" e "Sair"', async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
      const profileImg = screen.getByAltText('Perfil');
      fireEvent.click(profileImg);
      await waitFor(() => {
        expect(screen.getByRole('link', { name: /Meu Perfil/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sair/i })).toBeInTheDocument();
      });
      expect(screen.getByRole('link', { name: /Meu Perfil/i })).toHaveAttribute('href', `/perfil`); 
    });
    test('clicar em "Sair" deve chamar logout e redirecionar para /login', async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
      const profileImg = screen.getByAltText('Perfil');
      fireEvent.click(profileImg); 
      const logoutButton = await screen.findByRole('button', { name: /Sair/i });
      fireEvent.click(logoutButton);
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
    test('o link "Meu Perfil" deve navegar para o perfil correto baseado na role (apoiador)', async () => {
        render(<MemoryRouter><Navbar /></MemoryRouter>);
        const profileImg = screen.getByAltText('Perfil');
        fireEvent.click(profileImg); 
        const meuPerfilLink = await screen.findByRole('link', { name: /Meu Perfil/i });
        expect(meuPerfilLink).toHaveAttribute('href', '/perfil');
    });
    test('o link "Assinaturas" deve aparecer e ter o caminho correto se for apoiador', async () => {
        render(<MemoryRouter><Navbar /></MemoryRouter>);
        const apoieDropdownToggle = screen.getByText(/Apoie/i); 
        fireEvent.click(apoieDropdownToggle); 
        await waitFor(() => {
            expect(screen.getByRole('link', { name: /Assinaturas/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /Assinaturas/i })).toHaveAttribute('href', '/assinaturas');
        });
    });
    test('o link "Gerenciar Assinatura" deve aparecer e ter o caminho correto se for apoiador', async () => {
        render(<MemoryRouter><Navbar /></MemoryRouter>);
        const profileImg = screen.getByAltText('Perfil');
        fireEvent.click(profileImg); 
        await waitFor(() => { 
            expect(screen.getByRole('link', { name: /Gerenciar Assinatura/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /Gerenciar Assinatura/i })).toHaveAttribute('href', '/gerenciar-assinatura');
        });
    });
    test('o link "Meu Perfil" deve navegar para /perfil-aluno se a role for aluno', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: () => true,
            user: { id: 'aluno456', role: 'aluno', name: 'Aluno Teste', foto_path: '/path/to/aluno.jpg' },
            logout: mockLogout,
        });
        render(<MemoryRouter><Navbar /></MemoryRouter>);
        const profileImg = screen.getByAltText('Perfil');
        fireEvent.click(profileImg); 
        const meuPerfilLink = await screen.findByRole('link', { name: /Meu Perfil/i });
        expect(meuPerfilLink).toHaveAttribute('href', '/perfil-aluno');
    });
    test('o link "Gerenciar Assinatura" não deve aparecer se a role NÃO for apoiador', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: () => true,
            user: { id: 'prof789', role: 'professor', name: 'Prof Teste', foto_path: '/path/to/prof.jpg' },
            logout: mockLogout,
        });
        render(<MemoryRouter><Navbar /></MemoryRouter>);
        const profileImg = screen.getByAltText('Perfil');
        fireEvent.click(profileImg); 
        expect(screen.queryByRole('link', { name: /Gerenciar Assinatura/i })).not.toBeInTheDocument();
    });
    test('o link "Sobre" deve ter o href para a âncora #sobre', () => {
        render(<MemoryRouter><Navbar /></MemoryRouter>);
        const sobreLink = screen.getByRole('link', { name: /Sobre/i });
        expect(sobreLink).toHaveAttribute('href', '/#sobre');
    });
  });
});