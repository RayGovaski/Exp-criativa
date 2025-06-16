import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SidebarPerfilADM from '../adm/Sidebar-perfil-ADM/SidebarPerfilADM'; 
jest.mock('../adm/Sidebar-perfil-ADM/Sidebar-perfil-adm.css', () => ({})); 
jest.mock('react-icons/md', () => ({
  MdDashboard: () => <svg data-testid="icon-dashboard" />,
  MdGroupAdd: () => <svg data-testid="icon-groupadd" />,
  MdAddBox: () => <svg data-testid="icon-addbox" />,
  MdPeople: () => <svg data-testid="icon-people" />,
  MdDeleteForever: () => <svg data-testid="icon-deleteforever" />,
  MdMenu: () => <svg data-testid="icon-menu" />,
  MdClose: () => <svg data-testid="icon-close" />,
}));
describe('SidebarPerfilADM', () => {
  const mockSetSecaoAtiva = jest.fn();
  const mockToggleMobileMenu = jest.fn();
  const renderSidebar = (props = {}) => {
    return render(
      <SidebarPerfilADM
        setSecaoAtiva={mockSetSecaoAtiva}
        secaoAtiva={props.secaoAtiva || 'relatorios'} 
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
  test('deve renderizar o título e todos os links de navegação no desktop', () => {
    renderSidebar(); 
    expect(screen.getByAltText('Admin Profile')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('Administrador')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Relatórios/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Criar Turma/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Criar Card Doação/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Criar Perfil Professor/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Toggle navigation menu/i })).not.toBeVisible();
  });
  test('o link de "Criar Turma" deve estar ativo quando secaoAtiva for "criarTurma"', () => {
    renderSidebar({ secaoAtiva: 'criarTurma' });
    const criarTurmaItem = screen.getByRole('link', { name: /Criar Turma/i }).closest('.list-group-item'); 
    expect(criarTurmaItem).toHaveClass('active');
    const relatoriosItem = screen.getByRole('link', { name: /Relatórios/i }).closest('.list-group-item');
    expect(relatoriosItem).not.toHaveClass('active');
  });
  test('clicar em um link de navegação no desktop deve chamar setSecaoAtiva e não o toggleMobileMenu', () => {
    renderSidebar();
    const criarCardDoacaoLink = screen.getByRole('link', { name: /Criar Card Doação/i });
    fireEvent.click(criarCardDoacaoLink);
    expect(mockSetSecaoAtiva).toHaveBeenCalledTimes(1);
    expect(mockSetSecaoAtiva).toHaveBeenCalledWith('criarDoacao');
    expect(mockToggleMobileMenu).not.toHaveBeenCalled();
  });
  test('deve abrir o sidebar em modo mobile ao clicar no botão de hambúrguer', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 320 });
    renderSidebar({ isMobileOpen: false }); 
    const hamburgerButton = screen.getByRole('button', { name: /Toggle navigation menu/i });
    expect(hamburgerButton).toBeVisible();
    expect(screen.getByTestId('icon-menu')).toBeInTheDocument(); 
    fireEvent.click(hamburgerButton); 
    expect(mockToggleMobileMenu).toHaveBeenCalledTimes(1);
    renderSidebar({ isMobileOpen: true });
    expect(screen.getByTestId('icon-close').closest('.sidebar-perfil-adm')).toHaveClass('mobile-open'); 
    expect(screen.getByRole('button', { name: /Toggle navigation menu/i })).toBeInTheDocument(); 
    expect(screen.getByTestId('icon-close')).toBeInTheDocument(); 
    expect(screen.getByRole('button', { name: /Toggle navigation menu/i }).closest('.sidebar-overlay-adm')).toBeInTheDocument(); 
  });
  test('deve fechar o sidebar em modo mobile ao clicar em um link de navegação', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 320 });
    renderSidebar({ isMobileOpen: true }); 
    const relatoriosLink = screen.getByRole('link', { name: /Relatórios/i });
    fireEvent.click(relatoriosLink); 
    expect(mockSetSecaoAtiva).toHaveBeenCalledTimes(1);
    expect(mockSetSecaoAtiva).toHaveBeenCalledWith('relatorios');
    expect(mockToggleMobileMenu).toHaveBeenCalledTimes(1);
  });
  test('deve fechar o sidebar em modo mobile ao clicar no overlay', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 320 });
    renderSidebar({ isMobileOpen: true }); 
    const overlay = screen.getByRole('button', { name: /Toggle navigation menu/i }).closest('.sidebar-overlay-adm'); 
    expect(overlay).toBeInTheDocument(); 
    fireEvent.click(overlay);
    expect(mockToggleMobileMenu).toHaveBeenCalledTimes(1);
  });
});