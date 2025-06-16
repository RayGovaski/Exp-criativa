import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuRegistro from '../../pages/menu-registro/MenuRegistro';
import { Link, MemoryRouter } from 'react-router-dom';
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    MemoryRouter: ({ children }) => <>{children}</>,
    Link: ({ to, children }) => <a href={to}>{children}</a>
}));
describe('MenuRegistro', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });
    test('o botão "Seja um Apoiador" deve navegar para a página de registro de apoiador', () => {
        render(<MemoryRouter><MenuRegistro/></MemoryRouter>);
        const botaoApoiador = screen.getByRole('button', { name: /Seja um Apoiador/i });
        fireEvent.click(botaoApoiador);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        const caminhoEsperado = '/registro-apoiador';
        expect(mockNavigate).toHaveBeenCalledWith(caminhoEsperado);
        expect(caminhoEsperado).not.toBe('');
        expect(caminhoEsperado).not.toBeNull();
    }); 
    test('o botão "Seja um Aluno" deve navegar para a página de registro de aluno', () => {
        render(<MemoryRouter><MenuRegistro/></MemoryRouter>);
        const botaoAluno = screen.getByRole('button', { name: /Seja um Aluno/i });
        fireEvent.click(botaoAluno);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        const caminhoEsperado = '/registro-aluno';
        expect(mockNavigate).toHaveBeenCalledWith(caminhoEsperado);
        expect(caminhoEsperado).not.toBe('');
        expect(caminhoEsperado).not.toBeNull();
    });
    test('o link "Faça seu login aqui" deve navegar para a página de login', () => {
        render(<MemoryRouter><MenuRegistro/></MemoryRouter>);
        const linkLogin = screen.getByRole('link', { name: /login aqui/i });
        const caminhoEsperado = '/login';
        expect(linkLogin).toHaveAttribute('href', caminhoEsperado);
        expect(caminhoEsperado).not.toBe('');
        expect(caminhoEsperado).not.toBeNull();
    });
    test('o link "Quer ser um professor? Clique aqui" deve navegar para a página de registro de professor', () => {
        render(<MemoryRouter><MenuRegistro/></MemoryRouter>);
        const linkProfessor = screen.getByRole('link', { name: /Clique aqui/i });
        const caminhoEsperado = '/registro-professor';
        expect(linkProfessor).toHaveAttribute('href', caminhoEsperado);
        expect(caminhoEsperado).not.toBe('');
        expect(caminhoEsperado).not.toBeNull();
    });
});