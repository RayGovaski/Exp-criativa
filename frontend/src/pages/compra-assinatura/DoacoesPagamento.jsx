// src\pages\compra-assinatura\DoacoesPagamento.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, FileText } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; 
import "./DoacoesPagamento.css";
import { ProgressBar } from 'react-bootstrap'; // Import ProgressBar

const paymentMethods = [
    { id: 'credit', name: 'Cartão de Crédito', icon: CreditCard },
    { id: 'debit', name: 'Cartão de Débito', icon: CreditCard },
    { id: 'pix', name: 'Pix', icon: Smartphone },
    { id: 'boleto', name: 'Boleto', icon: FileText }
];

const DoacoesPagamento = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, token, isAuthenticated } = useAuth(); 

    const { preSelectedCauseId } = location.state || {}; 

    const [donationAmount, setDonationAmount] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [customerData, setCustomerData] = useState({
        name: '',
        email: '',
        phone: '',
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCvv: ''
    });
    const [loadingProject, setLoadingProject] = useState(true);
    const [projectError, setProjectError] = useState(null);
    const [selectedProjectData, setSelectedProjectData] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (!preSelectedCauseId) {
                setProjectError("Nenhum projeto de doação selecionado. Redirecionando...");
                setTimeout(() => navigate('/doar'), 2000); 
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8000/doacoes/${preSelectedCauseId}`);
                setSelectedProjectData(response.data);
            } catch (err) {
                console.error("Erro ao buscar detalhes do projeto:", err);
                setProjectError("Erro ao carregar detalhes do projeto. Tente novamente.");
            } finally {
                setLoadingProject(false);
            }
        };

        fetchProjectDetails();
    }, [preSelectedCauseId, navigate]);


    const handleInputChange = (field, value) => {
        setCustomerData(prev => ({ ...prev, [field]: value }));
    };

    const handleDonationAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*([.,]\d{0,2})?$/.test(value) || value === '') {
            setDonationAmount(value.replace(',', '.')); 
        }
    };

    const handleDonate = async () => {
        if (!donationAmount || parseFloat(donationAmount) <= 0 || !preSelectedCauseId || !selectedPayment) {
            alert('Por favor, insira um valor de doação válido e selecione um método de pagamento.');
            return;
        }

        const valorNumerico = parseFloat(donationAmount);

        if (!isAuthenticated() && (!customerData.name || !customerData.email || !customerData.phone)) {
            alert('Por favor, preencha seus dados (Nome, Email, Telefone) para continuar.');
            return;
        }

        if ((selectedPayment === 'credit' || selectedPayment === 'debit') && 
            (!customerData.cardNumber || !customerData.cardName || !customerData.cardExpiry || !customerData.cardCvv)) {
            alert('Por favor, preencha todos os dados do cartão.');
            return;
        }

        const donationPayload = {
            doacaoId: preSelectedCauseId,
            valorDoado: valorNumerico,
            ...(isAuthenticated() ? {} : { 
                customerName: customerData.name,
                customerEmail: customerData.email,
                customerPhone: customerData.phone,
            }),
            ...(selectedPayment === 'credit' || selectedPayment === 'debit' ? customerData : {}),
            metodoPagamento: selectedPayment 
        };

        try {
            const headers = { 'Content-Type': 'application/json' };
            if (token) { 
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await axios.post('http://localhost:8000/doacoes/doar-valor', donationPayload, { headers });

            alert(response.data.message);
            navigate('/doar'); 
        } catch (error) {
            console.error("Erro ao processar doação:", error);
            let errorMessage = "Ocorreu um erro ao processar sua doação.";
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }
            alert(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4 mt-4">
                        Faça sua Doação para "{selectedProjectData?.titulo || 'Carregando...'}"
                    </h1>
                    <div className="w-24 h-1 bg-pink-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Sua generosidade transforma vidas! Preencha os detalhes da sua doação abaixo.
                    </p>
                </div>

                {/* Seção de Detalhes do Projeto Selecionado */}
                {selectedProjectData && ( 
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                            Detalhes do Projeto
                        </h2>
                        <p className="text-lg text-gray-700 mb-2"><strong>Projeto:</strong> {selectedProjectData.titulo}</p>
                        <p className="text-md text-gray-600 mb-4">{selectedProjectData.descricao}</p>
                        <ProgressBar 
                            now={selectedProjectData.porcentagem} 
                            label={`${selectedProjectData.arrecadado.toFixed(2).replace('.', ',')} / ${selectedProjectData.valorMeta.toFixed(2).replace('.', ',')} (Meta: ${selectedProjectData.porcentagem}%)`} 
                            className="mb-3" 
                        />
                    </div>
                )}

                {/* 1. Donation Amount Input */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Qual o valor da sua doação?
                    </h2>
                    <div className="flex justify-center items-center mb-6">
                        <span className="text-3xl font-bold text-gray-700 mr-2">R$</span>
                        <input
                            type="text"
                            value={donationAmount}
                            onChange={handleDonationAmountChange}
                            className="w-64 px-4 py-3 border border-gray-300 rounded-lg text-3xl font-bold text-center focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="0,00"
                        />
                    </div>
                </div>

                {/* 2. Payment Method Selection */}
                {donationAmount && parseFloat(donationAmount) > 0 && ( 
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                            Método de Pagamento
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            {paymentMethods.map((method) => {
                                const IconComponent = method.icon;
                                return (
                                    <div
                                        key={method.id}
                                        // --- CORREÇÃO AQUI: Garanta que a template string esteja fechada ---
                                        // Aparentemente, faltou o ` no final de `selected` ou o ` antes de relative
                                        // Ou a classe `relative` estava fora da template string.
                                        className={`payment-method-card ${
                                            selectedPayment === method.id ? 'selected' : ''
                                        } relative`} 
                                        // A linha 189 é onde a classe é construída.
                                        // A string deve ser `className="..."`
                                        // A interpolação de variáveis é `${minhaVariavel}`
                                        // Se houver ternário, é `${condicao ? 'valor1' : 'valor2'}`
                                        // E o ` deve fechar a template string.
                                        onClick={() => setSelectedPayment(method.id)}
                                    >
                                        <IconComponent className="method-icon" />
                                        <p className="method-name">
                                            {method.name}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. Customer Information Form (Escondido se LOGADO) */}
                {donationAmount && parseFloat(donationAmount) > 0 && selectedPayment && !isAuthenticated() && ( 
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Seus Dados
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    value={customerData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="Seu nome completo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    E-mail *
                                </label>
                                <input
                                    type="email"
                                    value={customerData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    value={customerData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="(11) 99999-9999"
                                />
                            </div>
                        </div>

                        {/* Payment Details (condicionais ao método de pagamento) */}
                        {(selectedPayment === 'credit' || selectedPayment === 'debit') && (
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Dados do Cartão
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Número do Cartão *
                                        </label>
                                        <input
                                            type="text"
                                            value={customerData.cardNumber}
                                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            placeholder="0000 0000 0000 0000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nome no Cartão *
                                        </label>
                                        <input
                                            type="text"
                                            value={customerData.cardName}
                                            onChange={(e) => handleInputChange('cardName', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                            placeholder="Nome como no cartão"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Validade *
                                            </label>
                                            <input
                                                type="text"
                                                value={customerData.cardExpiry}
                                                onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                                placeholder="MM/AA"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                CVV *
                                            </label>
                                            <input
                                                type="text"
                                                value={customerData.cardCvv}
                                                onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                                placeholder="000"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedPayment === 'pix' && (
                            <div className="border-t pt-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Pagamento via Pix
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Após confirmar, você receberá o QR Code para pagamento de <strong>R$ {parseFloat(donationAmount).toFixed(2).replace('.', ',')}</strong>
                                </p>
                                <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto">
                                    <p className="text-gray-500">QR Code será gerado</p>
                                </div>
                            </div>
                        )}

                        {selectedPayment === 'boleto' && (
                            <div className="border-t pt-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Pagamento via Boleto
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    O boleto de <strong>R$ {parseFloat(donationAmount).toFixed(2).replace('.', ',')}</strong> será gerado após a confirmação
                                </p>
                                <p className="text-sm text-gray-500">
                                    Prazo de compensação: até 3 dias úteis
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Button */}
                {donationAmount && parseFloat(donationAmount) > 0 && selectedPayment && ( 
                    <div className="text-center">
                        <button
                            onClick={handleDonate}
                            className="confirm-button"
                        >
                            Confirmar Doação - R$ {parseFloat(donationAmount).toFixed(2).replace('.', ',')}
                        </button>

                        <p className="text-sm text-gray-500 mt-4">
                            Ao confirmar, você concorda com nossos termos de uso e política de privacidade
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoacoesPagamento;