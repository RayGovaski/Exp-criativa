import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SidebarPerfilProfessor from '../adm/Sidebar-perfil-professor/SidebarPerfilProfessor'; 
jest.mock('../adm/Sidebar-perfil-professor/SidebarPerfilProfessor.css', () => ({})); 
jest.mock('react-icons/fa', () => ({
  FaUser: () => <svg data-testid="icon-user" />,
  FaUsers: () => <svg data-testid="icon-users" />,
  FaBars: () => <svg data-testid="icon-bars" />,
  FaTimes: () => <svg data-testid="icon-times" />,
}));
describe('SidebarPerfilProfessor', () => {
  const mockSetSecaoAtiva = jest.fn();
  const mockToggleMobileMenu = jest.fn();
  const renderSidebar = (props = {}) => {
    return render(
      <SidebarPerfilProfessor
        setSecaoAtiva={mockSetSecaoAtiva}
        secaoAtiva={props.secaoAtiva || 'dados'} 
        isMobileOpen={props.isMobileOpen || false}
        toggleMobileMenu={mockToggleMobileMenu}
      />
    );
  };
  beforeEach(() => {
    mockSetSecaoAtiva.mockClear();
    mockToggleMobileMenu.mockClear();
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
  });
  test('deve renderizar todos os links de navegação no desktop', () => {
    renderSidebar(); 
    expect(screen.getByRole('link', { name: /Dados Pessoais/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Turmas \/ Chamada/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Toggle navigation menu/i })).not.toBeVisible();
  });
  test('o link de "Turmas / Chamada" deve estar ativo quando secaoAtiva for "turmas"', () => {
    renderSidebar({ secaoAtiva: 'turmas' });
    const turmasLink = screen.getByRole('link', { name: /Turmas \/ Chamada/i });
    expect(turmasLink).toHaveClass('active');
    const dadosPessoaisLink = screen.getByRole('link', { name: /Dados Pessoais/i });
    expect(dadosPessoaisLink).not.toHaveClass('active');
  });
  test('clicar em um link de navegação no desktop deve chamar setSecaoAtiva e não o toggleMobileMenu', () => {
    renderSidebar();
    const dadosPessoaisLink = screen.getByRole('link', { name: /Dados Pessoais/i });
    fireEvent.click(dadosPessoaisLink);
    expect(mockSetSecaoAtiva).toHaveBeenCalledTimes(1);
    expect(mockSetSecaoAtiva).toHaveBeenCalledWith('dados');
    expect(mockToggleMobileMenu).not.toHaveBeenCalled();
  });
  test('deve abrir o sidebar em modo mobile ao clicar no botão de hambúrguer', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 320 });
    renderSidebar({ isMobileOpen: false }); 
    const hamburgerButton = screen.getByRole('button', { name: /Toggle navigation menu/i });
    expect(hamburgerButton).toBeVisible();
    expect(screen.getByTestId('icon-bars')).toBeInTheDocument(); 
    fireEvent.click(hamburgerButton); 
    expect(mockToggleMobileMenu).toHaveBeenCalledTimes(1);
    renderSidebar({ isMobileOpen: true });
    expect(screen.getByTestId('icon-times').closest('.sidebar-perfil-professor')).toHaveClass('mobile-open'); 
    expect(screen.getByTestId('icon-times')).toBeInTheDocument(); 
  });
  test('deve fechar o sidebar em modo mobile ao clicar em um link de navegação', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 320 });
    renderSidebar({ isMobileOpen: true }); 
    const turmasLink = screen.getByRole('link', { name: /Turmas \/ Chamada/i });
    fireEvent.click(turmasLink); 
    expect(mockSetSecaoAtiva).toHaveBeenCalledTimes(1);
    expect(mockSetSecaoAtiva).toHaveBeenCalledWith('turmas');
    expect(mockToggleMobileMenu).toHaveBeenCalledTimes(1);
  });
  test('deve fechar o sidebar em modo mobile ao clicar no overlay', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 320 });
    renderSidebar({ isMobileOpen: true }); 
    const overlay = screen.getByRole('button', { name: /Toggle navigation menu/i }).closest('.sidebar-overlay-professor'); 
    expect(overlay).toBeInTheDocument(); 
    fireEvent.click(overlay);
    expect(mockToggleMobileMenu).toHaveBeenCalledTimes(1);
  });
});