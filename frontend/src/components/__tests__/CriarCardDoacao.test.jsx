import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CriarCardDoacao from '../comp-perfil-apoiador/criarDoacaoAdm/CriarCardDoacao'; 
jest.mock('../comp-perfil-apoiador/criarDoacaoAdm/CriarCardDoacao.css', () => ({})); 
describe('CriarCardDoacao', () => {
  let consoleSpy;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleSpy.mockRestore();
  });
  test('deve renderizar todos os campos do formulário e o botão de submissão', () => {
    render(<CriarCardDoacao />);
    expect(screen.getByRole('heading', { name: /Criar Card de Doação/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Título da Doação/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Meta \(\$\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/URL da Imagem/i)).toBeInTheDocument(); 
    expect(screen.getByRole('button', { name: /Criar Card/i })).toBeInTheDocument();
  });
  test('deve preencher e submeter o formulário, limpar os campos e logar os dados corretos', async () => {
    render(<CriarCardDoacao />);
    const tituloInput = screen.getByLabelText(/Título da Doação/i);
    const descricaoTextarea = screen.getByLabelText(/Descrição/i);
    const metaInput = screen.getByLabelText(/Meta \(\$\)/i);
    const imagemUrlInput = screen.getByLabelText(/URL da Imagem/i);
    const submitButton = screen.getByRole('button', { name: /Criar Card/i });
    fireEvent.change(tituloInput, { target: { value: 'Doação para Material Escolar' } });
    fireEvent.change(descricaoTextarea, { target: { value: 'Ajude a comprar materiais para nossos alunos.' } });
    fireEvent.change(metaInput, { target: { value: '5000.00' } });
    fireEvent.change(imagemUrlInput, { target: { value: 'https:
    expect(tituloInput).toHaveValue('Doação para Material Escolar');
    expect(descricaoTextarea).toHaveValue('Ajude a comprar materiais para nossos alunos.');
    expect(metaInput).toHaveValue(5000); 
    expect(imagemUrlInput).toHaveValue('https:
    await act(async () => {
      fireEvent.click(submitButton); 
    });
    expect(consoleSpy).toHaveBeenCalledWith('Formulário de Criar Card de Doação submetido!');
    expect(consoleSpy).toHaveBeenCalledWith({
      titulo: 'Doação para Material Escolar',
      descricao: 'Ajude a comprar materiais para nossos alunos.',
      meta: 5000.00,
      imagemUrl: 'https:
    });
    expect(tituloInput).toHaveValue('');
    expect(descricaoTextarea).toHaveValue('');
    expect(metaInput).toHaveValue(null); 
    expect(imagemUrlInput).toHaveValue('');
  });
  /*
  test('não deve submeter o formulário se campos obrigatórios estiverem vazios', async () => {
    render(<CriarCardDoacao />);
    const submitButton = screen.getByRole('button', { name: /Criar Card/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(consoleSpy).not.toHaveBeenCalledWith('Formulário de Criar Card de Doação submetido!');
    expect(screen.getByLabelText(/Título da Doação/i)).toHaveValue('');
  });
  */
});