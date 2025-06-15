import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SidebarPerfilAluno from '../adm/sidebar-perfil-aluno/SidebarPerfilAluno'; 
jest.mock('../adm/sidebar-perfil-aluno/SidebarPerfilAluno.css', () => ({})); 
jest.mock('react-icons/fa', () => ({
  FaUser: () => <svg data-testid="icon-user" />,
  FaChartBar: () => <svg data-testid="icon-chartbar" />,
  FaBook: () => <svg data-testid="icon-book" />,
  FaChalkboardTeacher: () => <svg data-testid="icon-chalkboardteacher" />,
  FaTrashAlt: () => <svg data-testid="icon-trashalt" />,
  FaBars: () => <svg data-testid="icon-bars" />,
  FaTimes: () => <svg data-testid="icon-times" />,
}));
describe('SidebarPerfilAluno', () => {
  const mockSetSecaoAtiva = jest.fn();
  const mockToggleMobileMenu = jest.fn();
  const renderSidebar = (props = {}) => {
    return render(
      <SidebarPerfilAluno
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
    expect(screen.getByRole('link', { name: /Faltas/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Minhas Matérias/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Minha Sala/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Deletar Conta/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Toggle navigation menu/i })).not.toBeVisible();
  });
  test('o link de "Minhas Matérias" deve estar ativo quando secaoAtiva for "materias"', () => {
    renderSidebar({ secaoAtiva: 'materias' });
    const materiasLink = screen.getByRole('link', { name: /Minhas Matérias/i });
    expect(materiasLink).toHaveClass('active');
    const dadosPessoaisLink = screen.getByRole('link', { name: /Dados Pessoais/i });
    expect(dadosPessoaisLink).not.toHaveClass('active');
  });
  test('clicar em um link de navegação no desktop deve chamar setSecaoAtiva e não o toggleMobileMenu', () => {
    renderSidebar();
    const faltasLink = screen.getByRole('link', { name: /Faltas/i });
    fireEvent.click(faltasLink);
    expect(mockSetSecaoAtiva).toHaveBeenCalledTimes(1);
    expect(mockSetSecaoAtiva).toHaveBeenCalledWith('relatorios'); 
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
    expect(screen.getByTestId('icon-times').closest('.sidebar-perfil-aluno')).toHaveClass('mobile-open'); 
    expect(screen.getByTestId('icon-times')).toBeInTheDocument(); 
  });
  test('deve fechar o sidebar em modo mobile ao clicar em um link de navegação', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 320 });
    renderSidebar({ isMobileOpen: true }); 
    const minhaSalaLink = screen.getByRole('link', { name: /Minha Sala/i });
    fireEvent.click(minhaSalaLink); 
    expect(mockSetSecaoAtiva).toHaveBeenCalledTimes(1);
    expect(mockSetSecaoAtiva).toHaveBeenCalledWith('sala');
    expect(mockToggleMobileMenu).toHaveBeenCalledTimes(1);
  });
  test('deve fechar o sidebar em modo mobile ao clicar no overlay', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 320 });
    renderSidebar({ isMobileOpen: true }); 
    const overlay = screen.getByRole('button', { name: /Toggle navigation menu/i }).closest('.sidebar-overlay-aluno'); 
    expect(overlay).toBeInTheDocument(); 
    fireEvent.click(overlay);
    expect(mockToggleMobileMenu).toHaveBeenCalledTimes(1);
  });
});