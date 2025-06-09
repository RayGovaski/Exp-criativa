import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, FileText, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Importe para redirecionamento
import { useAuth } from "../../context/AuthContext";
import axios from 'axios'; // Importe o axios para fazer requisições HTTP
import "./AssinaturaPagamento.css";

const plans = [
    {
        id: 'semente',
        dbId: 1, // <--- Adicione o ID correspondente no seu banco de dados
        title: "Plano Semente",
        subtitle: "(Toda ajuda faz a diferença!)",
        price: "R$ 20/mês",
        numericPrice: 20,
        description: "Com o Plano Semente, você planta esperança no futuro de muitas crianças! Sua doação ajuda a fornecer materiais essenciais para as aulas e garante a continuidade do nosso projeto.",
        highlightColor: "selected-plan-border-blue"
    },
    {
        id: 'melodia',
        dbId: 2, // <--- Adicione o ID correspondente
        title: "Plano Melodia",
        subtitle: "(Dando voz ao futuro!)",
        price: "R$ 50/mês",
        numericPrice: 50,
        description: "O Plano Melodia fortalece o ensino da música, garantindo que mais crianças tenham acesso a instrumentos e aulas, trazendo experiências que transformam vidas e abrem novas possibilidades no futuro!",
        highlightColor: "selected-plan-border-cyan"
    },
    {
        id: 'palco',
        dbId: 3, // <--- Adicione o ID correspondente
        title: "Plano Palco",
        subtitle: "(A arte que muda vidas!)",
        price: "R$ 100/mês",
        numericPrice: 100,
        description: "O Plano Palco apoia o desenvolvimento artístico das crianças, ajudando a criar momentos inesquecíveis e dando mais oportunidades para que elas brilhem no palco e na vida!",
        highlightColor: "selected-plan-border-blue"
    },
    {
        id: 'estrela',
        dbId: 4, // <--- Adicione o ID correspondente
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
    const [cardData, setCardData] = useState({ // Renomeado para refletir que são apenas dados de cartão
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCvv: ''
    });

    const navigate = useNavigate();
    const { user, token } = useAuth(); // Obtenha o usuário e o token do contexto de autenticação

    // Proteção de rota: redireciona se não houver token
    useEffect(() => {
        if (!token) {
            navigate('/login'); // Redirecione para sua rota de login
        }
    }, [token, navigate]);

    const handleCardInputChange = (field, value) => {
        setCardData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubscribe = async () => {
        if (!selectedPlan || !selectedPayment) {
            alert('Por favor, selecione um plano e método de pagamento.');
            return;
        }

        if (!user || !user.id) {
            alert('Erro: ID do apoiador não encontrado. Por favor, faça login novamente.');
            navigate('/login');
            return;
        }

        const plan = plans.find(p => p.id === selectedPlan);
        const payment = paymentMethods.find(p => p.id === selectedPayment);

        // Validação básica para cartão (se selecionado)
        if ((selectedPayment === 'credit' || selectedPayment === 'debit') && 
            (!cardData.cardNumber || !cardData.cardName || !cardData.cardExpiry || !cardData.cardCvv)) {
            alert('Por favor, preencha todos os dados do cartão.');
            return;
        }

        try {
            // Requisição para o backend
            const response = await axios.post('http://localhost:8000/apoiador/assinar-plano', {
                apoiadorId: user.id, // ID do apoiador logado
                planoId: plan.dbId,   // ID do plano selecionado
                // Você pode adicionar mais dados aqui, se necessário, como:
                // metodoPagamento: payment.id, 
                // dadosCartao: (selectedPayment === 'credit' || selectedPayment === 'debit') ? cardData : null
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Envia o token de autenticação
                }
            });

            if (response.status === 200 || response.status === 201) {
                alert(`Assinatura do ${plan.title} (${plan.price}) via ${payment.name} confirmada com sucesso!`);
                // Redirecione ou mostre uma mensagem de sucesso mais elaborada
                navigate('/assinatura');
            } else {
                alert('Erro ao processar assinatura. Tente novamente.');
            }
        } catch (error) {
            console.error("Erro ao assinar plano:", error);
            let errorMessage = "Ocorreu um erro ao processar sua assinatura.";
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }
            alert(errorMessage);
        }
    };

    const selectedPlanData = plans.find(p => p.id === selectedPlan);

    // Se o usuário não estiver autenticado, mostre um indicador de carregamento ou redirecione
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-lg text-gray-700">Carregando ou redirecionando para o login...</p>
            </div>
        );
    }

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

                {/* Payment Details (Apenas Cartão, sem dados do cliente) */}
                {selectedPlan && selectedPayment && (selectedPayment === 'credit' || selectedPayment === 'debit') && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Dados do Cartão
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Número do Cartão *
                                </label>
                                <input
                                    type="text"
                                    value={cardData.cardNumber}
                                    onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
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
                                    value={cardData.cardName}
                                    onChange={(e) => handleCardInputChange('cardName', e.target.value)}
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
                                        value={cardData.cardExpiry}
                                        onChange={(e) => handleCardInputChange('cardExpiry', e.target.value)}
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
                                        value={cardData.cardCvv}
                                        onChange={(e) => handleCardInputChange('cardCvv', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                        placeholder="000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedPlan && selectedPayment === 'pix' && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
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

                {selectedPlan && selectedPayment === 'boleto' && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
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