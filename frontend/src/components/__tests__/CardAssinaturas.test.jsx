import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CardAssinaturas from '../comp_home/CardAssinaturas';
import { Link, MemoryRouter } from 'react-router-dom';
const mockNavigate = jest.fn();
const mockUseAuth = jest.fn();
jest.mock('../../context/AuthContext', () => ({
    useAuth: () => mockUseAuth(),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    MemoryRouter: ({ children }) => <>{children}</>,
    Link: ({ to, children }) => <a href={to}>{children}</a>
}));
describe('CardAssinaturas', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        mockUseAuth.mockClear();
    });
    test('deve navegar para a página de cadastro se o usuário NÃO estiver logado', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            user: null
        });
        render(<MemoryRouter><CardAssinaturas/></MemoryRouter>);
        const botaoCardAssinaturas = screen.getByRole('button', { name: /Assine Seu Plano!/i})
        fireEvent.click(botaoCardAssinaturas);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        const caminhoEsperado = '/menu-registro';
        expect(mockNavigate).toHaveBeenCalledWith(caminhoEsperado);
        expect(caminhoEsperado).not.toBe('');
        expect(caminhoEsperado).not.toBeNull();
    })
    test('deve navegar para a página de assinatura se o usuário ESTIVER logado', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            user: { id: '1', name: 'Titi' }
        });
        render(<MemoryRouter><CardAssinaturas/></MemoryRouter>);
        const botaoCardAssinaturas = screen.getByRole('button', { name: /Cadastre-se e Assine Seu Plano!/i})
        fireEvent.click(botaoCardAssinaturas);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        const caminhoEsperado = '/doar';
        expect(mockNavigate).toHaveBeenCalledWith('/doar');
        expect(caminhoEsperado).not.toBe('');
        expect(caminhoEsperado).not.toBeNull();
    });
});