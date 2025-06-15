import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import TurmasChamadaProfessor from '../adm/turmas-chamada-professor/TurmasChamadaProfessor'; 
jest.mock('../adm/turmas-chamada-professor/TurmasChamadaProfessor.css', () => ({})); 
jest.mock('react-icons/fa', () => ({
  FaEdit: () => <svg data-testid="icon-edit" />,
  FaCheckCircle: () => <svg data-testid="icon-checkcircle" />,
  FaTimesCircle: () => <svg data-testid="icon-timescircle" />,
  FaCalendarAlt: () => <svg data-testid="icon-calendaralt" />,
}));
describe('TurmasChamadaProfessor', () => {
  const turmasComDados = [
    {
      id: 1,
      nome: 'Turma A - 3º Ano Fundamental',
      materia: 'Matemática',
      horario: 'Seg/Qua 08:00 - 10:00',
      sala: 'Sala 101',
      alunos: [
        { id: 101, nome: 'Lucas Pires', presente: false },
        { id: 102, nome: 'Sofia Almeida', presente: false },
      ],
    },
    {
      id: 2,
      nome: 'Turma B - 5º Ano Fundamental',
      materia: 'Português',
      horario: 'Ter/Qui 14:00 - 16:00',
      sala: 'Sala 203',
      alunos: [], 
    },
  ];
  const turmasVazias = [];
  let consoleSpy;
  let alertSpy;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-06-15T10:00:00Z')); 
  });
  afterEach(() => {
    consoleSpy.mockRestore();
    alertSpy.mockRestore();
    jest.useRealTimers(); 
  });
  test('deve renderizar o título e a lista de turmas disponíveis', () => {
    render(<TurmasChamadaProfessor turmas={turmasComDados} />);
    expect(screen.getByRole('heading', { name: /Minhas Turmas e Chamada/i })).toBeInTheDocument();
    expect(screen.getByText('Turma A - 3º Ano Fundamental')).toBeInTheDocument();
    expect(screen.getByText('Matemática')).toBeInTheDocument();
    expect(screen.getByText('Turma B - 5º Ano Fundamental')).toBeInTheDocument();
    expect(screen.getByText('Português')).toBeInTheDocument();
    expect(screen.queryByText(/Nenhuma turma atribuída no momento./i)).not.toBeInTheDocument();
  });
  test('deve exibir mensagem de "Nenhuma turma atribuída" quando a lista estiver vazia', () => {
    render(<TurmasChamadaProfessor turmas={turmasVazias} />);
    expect(screen.getByText(/Nenhuma turma atribuída no momento./i)).toBeInTheDocument();
    expect(screen.queryByText('Turma A - 3º Ano Fundamental')).not.toBeInTheDocument();
  });
  test('deve abrir o modal de chamada ao clicar em "Fazer Chamada" e fechar ao clicar em "Cancelar"', async () => {
    render(<TurmasChamadaProfessor turmas={turmasComDados} />);
    const fazerChamadaButton = screen.getAllByRole('button', { name: /Fazer Chamada/i })[0]; 
    fireEvent.click(fazerChamadaButton);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Fazer Chamada - Turma A - 3º Ano Fundamental/i })).toBeInTheDocument();
      expect(screen.getByText('Alunos:')).toBeInTheDocument();
      expect(screen.getByText('Lucas Pires')).toBeInTheDocument();
      expect(screen.getByText('Sofia Almeida')).toBeInTheDocument();
    });
    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(screen.queryByText(/Fazer Chamada - Turma A/i)).not.toBeInTheDocument();
    });
  });
  test('deve alternar a presença de um aluno ao clicar no botão de presença', async () => {
    render(<TurmasChamadaProfessor turmas={turmasComDados} />);
    const fazerChamadaButton = screen.getAllByRole('button', { name: /Fazer Chamada/i })[0];
    fireEvent.click(fazerChamadaButton);
    await waitFor(() => {
      expect(screen.getByText('Lucas Pires')).toBeInTheDocument();
    });
    const lucasPiresButton = screen.getByRole('button', { name: /Ausente/i });
    expect(lucasPiresButton).toBeInTheDocument(); 
    fireEvent.click(lucasPiresButton); 
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Presente/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Ausente/i })).not.toBeInTheDocument();
    });
  });
  test('deve salvar a chamada com os dados corretos e fechar o modal', async () => {
    render(<TurmasChamadaProfessor turmas={turmasComDados} />);
    const fazerChamadaButton = screen.getAllByRole('button', { name: /Fazer Chamada/i })[0];
    fireEvent.click(fazerChamadaButton);
    await waitFor(() => {
      expect(screen.getByText('Lucas Pires')).toBeInTheDocument();
    });
    const lucasPiresButton = screen.getByRole('button', { name: /Ausente/i });
    fireEvent.click(lucasPiresButton);
    const dataInput = screen.getByLabelText(/Data da Chamada/i);
    fireEvent.change(dataInput, { target: { value: '2025-06-15' } }); 
    const salvarChamadaButton = screen.getByRole('button', { name: /Salvar Chamada/i });
    fireEvent.click(salvarChamadaButton);
    expect(consoleSpy).toHaveBeenCalledWith('Chamada da Turma: Turma A - 3º Ano Fundamental, Data: 2025-06-15');
    expect(consoleSpy).toHaveBeenCalledWith('- Aluno: Lucas Pires, Presença: Presente');
    expect(consoleSpy).toHaveBeenCalledWith('- Aluno: Sofia Almeida, Presença: Ausente'); 
    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith('Chamada da turma Turma A - 3º Ano Fundamental para 2025-06-15 salva (simulado)!');
    await waitFor(() => {
      expect(screen.queryByText(/Fazer Chamada - Turma A/i)).not.toBeInTheDocument();
    });
  });
  test('botões de presença e salvar devem ser desabilitados após a chamada ser salva', async () => {
    render(<TurmasChamadaProfessor turmas={turmasComDados} />);
    const fazerChamadaButton = screen.getAllByRole('button', { name: /Fazer Chamada/i })[0];
    fireEvent.click(fazerChamadaButton);
    await waitFor(() => {
      expect(screen.getByText('Lucas Pires')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Ausente/i })); 
    fireEvent.click(screen.getByRole('button', { name: /Salvar Chamada/i })); 
    await waitFor(() => {
      fireEvent.click(fazerChamadaButton);
    });
    const lucasPiresToggle = screen.getByRole('button', { name: /Presente/i }); 
    expect(lucasPiresToggle).toBeDisabled();
    expect(screen.queryByRole('button', { name: /Salvar Chamada/i })).not.toBeInTheDocument(); 
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' })); 
  });
  test('deve exibir "Nenhum aluno nesta turma" no modal se a turma selecionada não tiver alunos', async () => {
    render(<TurmasChamadaProfessor turmas={turmasComDados} />);
    const fazerChamadaButtonTurmaB = screen.getAllByRole('button', { name: /Fazer Chamada/i })[1]; 
    fireEvent.click(fazerChamadaButtonTurmaB);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Fazer Chamada - Turma B - 5º Ano Fundamental/i })).toBeInTheDocument();
    });
    expect(screen.getByText('Nenhum aluno nesta turma.')).toBeInTheDocument();
    expect(screen.queryByRole('table', { name: /chamada-table/i })).not.toBeInTheDocument(); 
  });
});