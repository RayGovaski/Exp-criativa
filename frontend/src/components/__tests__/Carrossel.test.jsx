import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Carrossel from '../carrossel/Carrossel';
import { Link, MemoryRouter } from 'react-router-dom';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    MemoryRouter: ({ children }) => <>{children}</>,
    Link: ({ to, children }) => <a href={to}>{children}</a>
}));
describe('Carrossel', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });
    test('o botão Inscreva-se deve levar para a página de registro', () => {
        render( <MemoryRouter><Carrossel/></MemoryRouter>);
        const botaoInscrevase = screen.getByRole('link', { name: /Inscreva-se/i });
        const caminhoEsperado = '/menu-registro';
        expect(botaoInscrevase).toHaveAttribute('href', caminhoEsperado);
        expect(caminhoEsperado).not.toBe('');
        expect(caminhoEsperado).not.toBeNull();
    });
    test('o botão "Quero Contribuir" deve navegar para a página de assinatura', () => {
        render(<MemoryRouter><Carrossel/></MemoryRouter>);
        const botaoQueroContribuir = screen.getByRole('button', { name: /Quero Contribuir/i });
        fireEvent.click(botaoQueroContribuir);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        const caminhoEsperado = '/pages/compra-assinatura/assinaturapagamento';
        expect(mockNavigate).toHaveBeenCalledWith(caminhoEsperado);
        expect(caminhoEsperado).not.toBe('');
        expect(caminhoEsperado).not.toBeNull();
    });
});