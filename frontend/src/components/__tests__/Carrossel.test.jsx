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
    
    test('o Carrossel deve renderizar sem erros', () => {
        render( <MemoryRouter><Carrossel/></MemoryRouter>);
        const subtituloCarrossel = screen.getByRole('heading', { name: /Transformando sonhos/i });
        expect(subtituloCarrossel).toBeInTheDocument();
    });

    test('o botão "Quero Contribuir" deve navegar para a página de assinatura', () => {
        render(<MemoryRouter><Carrossel/></MemoryRouter>);
        const botaoQueroContribuir = screen.getByRole('button', { name: /Quero Contribuir/i });
        fireEvent.click(botaoQueroContribuir);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/pages/compra-assinatura/assinaturapagamento')
    });
});


