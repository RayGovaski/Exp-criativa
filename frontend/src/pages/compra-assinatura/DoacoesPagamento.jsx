import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CreditCard, Smartphone, FileText } from 'lucide-react';
import "./DoacoesPagamento.css";

const causes = [
    { id: '', title: 'Selecione um projeto para doar', description: '' },
    { id: 'infraestrutura', title: "Infraestrutura e Manutenção", description: "Ajuda a manter nosso espaço funcionando." },
    { id: 'materiais_pedagogicos', title: "Materiais Pedagógicos", description: "Para aquisição de livros, instrumentos, materiais de arte." },
    { id: 'bolsas_estudo', title: "Bolsas de Estudo", description: "Para financiar bolsas integrais." },
    { id: 'eventos_culturais', title: "Eventos e Apresentações", description: "Para realização de eventos culturais." },
    { id: 'violao', title: "Projeto: Compra de Violão", description: "Ajude a comprar um violão." },
    { id: 'roupas_acessorios', title: "Projeto: Roupas e Acessórios", description: "Contribua para a compra de roupas e acessórios." },
    { id: 'materiais_criativos', title: "Projeto: Materiais Criativos", description: "Garanta materiais de qualidade." },
    { id: 'microfones_aulas', title: "Projeto: Microfones para Aulas", description: "Ajude com equipamentos para aulas de canto e teatro." },
];

const paymentMethods = [
    { id: 'credit', name: 'Cartão de Crédito', icon: CreditCard },
    { id: 'debit', name: 'Cartão de Débito', icon: CreditCard },
    { id: 'pix', name: 'Pix', icon: Smartphone },
    { id: 'boleto', name: 'Boleto', icon: FileText }
];

const DoacoesPagamento = () => {
    const location = useLocation();
    const { preSelectedCauseId } = location.state || {};

    const [selectedCause, setSelectedCause] = useState(''); 
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

    useEffect(() => {
        if (preSelectedCauseId) {
            setSelectedCause(preSelectedCauseId);
        }
    }, [preSelectedCauseId]);

    const handleInputChange = (field, value) => {
        setCustomerData(prev => ({ ...prev, [field]: value }));
    };

    const handleDonationAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*([.,]\d{0,2})?$/.test(value) || value === '') {
            setDonationAmount(value.replace(',', '.'));
        }
    };

    const handleDonate = () => {
        if (!donationAmount || parseFloat(donationAmount) <= 0 || !selectedCause || selectedCause === '' || !selectedPayment) {
            alert('Por favor, insira um valor de doação válido, selecione um projeto e um método de pagamento.');
            return;
        }

        const cause = causes.find(c => c.id === selectedCause);
        const payment = paymentMethods.find(p => p.id === selectedPayment);

        alert(`Processando doação de R$ ${parseFloat(donationAmount).toFixed(2).replace('.', ',')} para o projeto "${cause.title}" via ${payment.name}.`);
    };

    const selectedCauseData = causes.find(c => c.id === selectedCause);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4 mt-4">
                        Faça sua Doação
                    </h1>
                    <div className="w-24 h-1 bg-pink-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Sua generosidade transforma vidas! Preencha os detalhes da sua doação abaixo.
                    </p>
                </div>

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

                {/* 2. Project Selection Dropdown */}
                {donationAmount && parseFloat(donationAmount) > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Para qual projeto você deseja doar?
                        </h2>
                        <div className="flex justify-center">
                            <select
                                value={selectedCause}
                                onChange={(e) => setSelectedCause(e.target.value)}
                                className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg text-lg text-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                                {causes.map((cause) => (
                                    <option key={cause.id} value={cause.id} disabled={cause.id === ''}>
                                        {cause.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedCauseData && selectedCauseData.description && selectedCause !== '' && (
                            <p className="text-sm text-gray-600 mt-4 text-center">
                                {selectedCauseData.description}
                            </p>
                        )}
                    </div>
                )}

                {/* 3. Payment Method Selection */}
                {donationAmount && parseFloat(donationAmount) > 0 && selectedCause && selectedCause !== '' && (
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
                                        className={`payment-method-card ${
                                            selectedPayment === method.id
                                                ? 'selected'
                                                : ''
                                        } relative`}
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

                {/* 4. Customer Information Form */}
                {donationAmount && parseFloat(donationAmount) > 0 && selectedCause && selectedCause !== '' && selectedPayment && (
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
                {donationAmount && parseFloat(donationAmount) > 0 && selectedCause && selectedCause !== '' && selectedPayment && (
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