import React, { useState } from 'react';
import { CreditCard, Smartphone, FileText, Building } from 'lucide-react';
import "./AssinaturaPagamento.css";

const plans = [
    {
        id: 'semente',
        title: "Plano Semente",
        subtitle: "(Toda ajuda faz a diferença!)",
        price: "R$ 20/mês",
        numericPrice: 20,
        description: "Com o Plano Semente, você planta esperança no futuro de muitas crianças! Sua doação ajuda a fornecer materiais essenciais para as aulas e garante a continuidade do nosso projeto.",
        highlightColor: "selected-plan-border-blue"
    },
    {
        id: 'melodia',
        title: "Plano Melodia",
        subtitle: "(Dando voz ao futuro!)",
        price: "R$ 50/mês",
        numericPrice: 50,
        description: "O Plano Melodia fortalece o ensino da música, garantindo que mais crianças tenham acesso a instrumentos e aulas, trazendo experiências que transformam vidas e abrem novas possibilidades no futuro!",
        highlightColor: "selected-plan-border-cyan" 
    },
    {
        id: 'palco',
        title: "Plano Palco",
        subtitle: "(A arte que muda vidas!)",
        price: "R$ 100/mês",
        numericPrice: 100,
        description: "O Plano Palco apoia o desenvolvimento artístico das crianças, ajudando a criar momentos inesquecíveis e dando mais oportunidades para que elas brilhem no palco e na vida!",
        highlightColor: "selected-plan-border-blue"
    },
    {
        id: 'estrela',
        title: "Plano Estrela",
        subtitle: "(Transformando futuros!)",
        price: "R$ 200/mês",
        numericPrice: 200,
        description: "O Plano Estrela apoia o desenvolvimento artístico das crianças, ajudando a criar momentos inesquecíveis e dando mais oportunidades para que elas brilhem no palco e na vida!",
        highlightColor: "selected-plan-border-cyan" 
    },
];

const paymentMethods = [
    { id: 'credit', name: 'Cartão de Crédito', icon: CreditCard },
    { id: 'debit', name: 'Cartão de Débito', icon: CreditCard },
    { id: 'pix', name: 'Pix', icon: Smartphone },
    { id: 'boleto', name: 'Boleto', icon: FileText }
];

const AssinaturaPagamento = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
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

    const handleInputChange = (field, value) => {
        setCustomerData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubscribe = () => {
        if (!selectedPlan || !selectedPayment) {
            alert('Por favor, selecione um plano e método de pagamento.');
            return;
        }

        const plan = plans.find(p => p.id === selectedPlan);
        const payment = paymentMethods.find(p => p.id === selectedPayment);

        alert(`Processando assinatura do ${plan.title} (${plan.price}) via ${payment.name}`);
    };

    const selectedPlanData = plans.find(p => p.id === selectedPlan);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4 mt-4">
                        Escolha seu Plano de Assinatura
                    </h1>
                    <div className="w-24 h-1 bg-pink-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Apoie nosso projeto com uma assinatura mensal e ajude a transformar vidas através da arte e educação.
                    </p>
                </div>

                {/* Plans Selection */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                        Selecione um Plano
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                                    selectedPlan === plan.id
                                        ? `${plan.highlightColor} shadow-lg transform scale-105`
                                        : 'border-gray-200 bg-white'
                                }`}
                                onClick={() => setSelectedPlan(plan.id)}
                            >
                                {/* Radio Button */}
                                <div className="absolute top-4 right-4">
                                    <input
                                        type="radio"
                                        name="plan"
                                        value={plan.id}
                                        checked={selectedPlan === plan.id}
                                        onChange={() => setSelectedPlan(plan.id)}
                                        className="w-5 h-5 text-pink-600 cursor-pointer"
                                    />
                                </div>

                                {/* Plan Content */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                                        {plan.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        {plan.subtitle}
                                    </p>
                                    <div className="text-2xl font-bold text-pink-600 mb-4">
                                        {plan.price}
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    {plan.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Method Selection */}
                {selectedPlan && (
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
                                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 text-center ${
                                            selectedPayment === method.id
                                                ? 'border-pink-600 bg-pink-50 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                        onClick={() => setSelectedPayment(method.id)}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={method.id}
                                            checked={selectedPayment === method.id}
                                            onChange={() => setSelectedPayment(method.id)}
                                            className="w-4 h-4 text-pink-600 mb-2"
                                        />
                                        <IconComponent className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                                        <p className="text-sm font-medium text-gray-700">
                                            {method.name}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Customer Information Form */}
                {selectedPlan && selectedPayment && (
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

                        {/* Payment Details */}
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
                                    Após confirmar, você receberá o QR Code para pagamento de <strong>{selectedPlanData?.price}</strong>
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
                                    O boleto de <strong>{selectedPlanData?.price}</strong> será gerado após a confirmação
                                </p>
                                <p className="text-sm text-gray-500">
                                    Prazo de compensação: até 3 dias úteis
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Button */}
                {selectedPlan && selectedPayment && (
                    <div className="text-center">
                        <button
                            onClick={handleSubscribe}
                            className="confirm-button"
                        >
                            Confirmar Assinatura - {selectedPlanData?.price}
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

export default AssinaturaPagamento;