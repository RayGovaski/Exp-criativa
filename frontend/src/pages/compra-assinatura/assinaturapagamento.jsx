import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, FileText, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import axios from 'axios';
import "./AssinaturaPagamento.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Spinner } from 'react-bootstrap'; // Importe Spinner também

const plans = [
    {
        id: 'semente',
        dbId: 1,
        title: "Plano Semente",
        subtitle: "(Toda ajuda faz a diferença!)",
        price: "R$ 20/mês",
        numericPrice: 20,
        description: "Com o Plano Semente, você planta esperança no futuro de muitas crianças! Sua doação ajuda a fornecer materiais essenciais para as aulas e garante a continuidade do nosso projeto.",
        highlightColor: "selected-plan-border-blue"
    },
    {
        id: 'melodia',
        dbId: 2,
        title: "Plano Melodia",
        subtitle: "(Dando voz ao futuro!)",
        price: "R$ 50/mês",
        numericPrice: 50,
        description: "O Plano Melodia fortalece o ensino da música, garantindo que mais crianças tenham acesso a instrumentos e aulas, trazendo experiências que transformam vidas e abrem novas possibilidades no futuro!",
        highlightColor: "selected-plan-border-cyan"
    },
    {
        id: 'palco',
        dbId: 3,
        title: "Plano Palco",
        subtitle: "(A arte que muda vidas!)",
        price: "R$ 100/mês",
        numericPrice: 100,
        description: "O Plano Palco apoia o desenvolvimento artístico das crianças, ajudando a criar momentos inesquecíveis e dando mais oportunidades para que elas brilhem no palco e na vida!",
        highlightColor: "selected-plan-border-blue"
    },
    {
        id: 'estrela',
        dbId: 4,
        title: "Plano Estrela",
        subtitle: "(Transformando futuros!)",
        price: "R$ 200/mês",
        numericPrice: 200,
        description: "O Plano Estrela apoia o desenvolvimento artístico das crianças, ajudando a criar momentos inesquecíveis e dando mais oportunidades para que elas brilhem no palco e na vida!",
        highlightColor: "selected-plan-border-cyan"
    },
];

// O nome desta constante estava duplicado. Renomeado para evitar conflitos.
const paymentMethodsList = [
    { id: 'credit', name: 'Cartão de Crédito', icon: CreditCard },
    { id: 'debit', name: 'Cartão de Débito', icon: CreditCard },
    { id: 'pix', name: 'Pix', icon: Smartphone },
    { id: 'boleto', name: 'Boleto', icon: FileText }
];

const AssinaturaPagamento = () => {
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCvv: ''
    });
    const [isLoading, setIsLoading] = useState(false); // NOVO: Estado de loading

    const [showModalTrocaPlano, setShowModalTrocaPlano] = useState(false);
    const [planToChangeTo, setPlanToChangeTo] = useState(null);


    useEffect(() => {
        const fetchCurrentSubscription = async () => {
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get('http://localhost:8000/apoiador/perfil', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data && response.data.plano_nome) {
                    setCurrentSubscription(response.data);
                } else {
                    setCurrentSubscription(null);
                }
            } catch (err) {
                console.error("Erro ao buscar plano atual:", err);
                setCurrentSubscription(null);
                // Pode adicionar um toast.error aqui também, se desejar notificar o usuário sobre falha na busca do plano atual.
            }
        };
        fetchCurrentSubscription();
    }, [token, navigate]);

    const handleCardInputChange = (field, value) => {
        setCardData(prev => ({ ...prev, [field]: value }));
    };

    const handleConfirmarTrocaPlano = async () => {
        setShowModalTrocaPlano(false); // Fecha o modal
        await executeSubscription(planToChangeTo); // Prossegue com a assinatura/troca de plano
    };

    // Função que realmente faz a requisição de assinatura/troca de plano
    const executeSubscription = async (plan) => {
        setIsLoading(true); // Inicia o loading
        toast.info("Processando sua assinatura...", { autoClose: false, closeButton: false, toastId: 'subscriptionProcess' });

        try {
            const response = await axios.post('http://localhost:8000/apoiador/assinar-plano', {
                apoiadorId: user.id,
                planoId: plan.dbId,
                formaPagamento: selectedPayment,
                ...(selectedPayment === 'credit' || selectedPayment === 'debit' ? {
                    cardNumber: cardData.cardNumber,
                    cardName: cardData.cardName,
                    cardExpiry: cardData.cardExpiry,
                    cardCvv: cardData.cardCvv
                } : {}),
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.dismiss('subscriptionProcess'); // Remove o toast de processamento
            toast.success(response.data.message || 'Assinatura realizada com sucesso!');
            setCurrentSubscription({ ...currentSubscription, plano_nome: plan.title, plano_preco: plan.numericPrice, data_adesao: new Date().toISOString() });

            // Atrasar a navegação para que o toast seja visível
            setTimeout(() => {
                navigate('/perfil');
            }, 6000); // 3 segundos para ler o toast

        } catch (error) {
            console.error("Erro ao assinar plano:", error);
            toast.dismiss('subscriptionProcess'); // Remove o toast de processamento

            let errorMessage = "Ocorreu um erro ao processar sua assinatura. Tente novamente.";
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else {
                    errorMessage = `Erro do servidor: ${error.response.status} - ${error.response.statusText || 'Mensagem desconhecida'}`;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false); // Finaliza o loading
        }
    };


    const handleSubscribe = async () => {
        // Validações iniciais (frontend)
        if (!selectedPlan || !selectedPayment) {
            toast.error('Por favor, selecione um plano e método de pagamento.');
            return; // NÃO coloca isLoading(false) aqui porque o isLoading só é true ao chamar executeSubscription
        }

        if (!user || !user.id) {
            toast.error('Erro: ID do apoiador não encontrado. Por favor, faça login novamente.');
            navigate('/login');
            return;
        }

        const plan = plans.find(p => p.id === selectedPlan);
        if (!plan) {
            toast.error('Plano selecionado inválido.');
            return;
        }

        if ((selectedPayment === 'credit' || selectedPayment === 'debit') &&
            (!cardData.cardNumber || cardData.cardNumber.trim() === '' ||
             !cardData.cardName || cardData.cardName.trim() === '' ||
             !cardData.cardExpiry || cardData.cardExpiry.trim() === '' ||
             !cardData.cardCvv || cardData.cardCvv.trim() === '')) {
            toast.error('Por favor, preencha todos os dados do cartão.');
            return;
        }

        // Lógica de verificação do plano atual para o modal de troca
        if (currentSubscription && currentSubscription.plano_nome) {
            if (currentSubscription.plano_nome === plan.title) {
                toast.info(`Você já está atualmente no plano ${plan.title}.`);
                return;
            } else {
                setPlanToChangeTo(plan); // Salva o plano para o qual queremos mudar
                setShowModalTrocaPlano(true); // Abre o modal de confirmação
                return; // Importante: retorna aqui para esperar a interação com o modal
            }
        }
        
        // Se não tem assinatura ativa (primeira assinatura), ou se a troca foi confirmada via modal
        // (executeSubscription é chamado por handleConfirmarTrocaPlano),
        // prossegue com a assinatura.
        await executeSubscription(plan);
    };

    const selectedPlanData = plans.find(p => p.id === selectedPlan);

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-content-center bg-gray-50">
                <p className="text-lg text-gray-700">Carregando ou redirecionando para o login...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
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

                {/* Exibir plano atual do usuário, se houver */}
                {currentSubscription && currentSubscription.plano_nome && (
                    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-8" role="alert">
                        <p className="font-bold">Plano Atual:</p>
                        <p>Você está atualmente no plano **{currentSubscription.plano_nome}**. Selecione um plano diferente abaixo para trocar.</p>
                    </div>
                )}

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
                                        : currentSubscription && currentSubscription.plano_nome === plan.title
                                            ? 'border-green-500 bg-green-50 shadow-md'
                                            : 'border-gray-200 bg-white'
                                }`}
                                onClick={() => !isLoading && setSelectedPlan(plan.id)} // Desabilita clique durante loading
                            >
                                {/* Radio Button */}
                                <div className="absolute top-4 right-4">
                                    <input
                                        type="radio"
                                        name="plan"
                                        value={plan.id}
                                        checked={selectedPlan === plan.id}
                                        onChange={() => !isLoading && setSelectedPlan(plan.id)} // Desabilita alteração durante loading
                                        className="w-5 h-5 text-pink-600 cursor-pointer"
                                        disabled={isLoading} // Desabilita o radio durante loading
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
                            {paymentMethodsList.map((method) => { // Usar paymentMethodsList
                                const IconComponent = method.icon;
                                return (
                                    <div
                                        key={method.id}
                                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 text-center ${
                                            selectedPayment === method.id
                                                ? 'border-pink-600 bg-pink-50 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                        onClick={() => !isLoading && setSelectedPayment(method.id)} // Desabilita clique durante loading
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={method.id}
                                            checked={selectedPayment === method.id}
                                            onChange={() => !isLoading && setSelectedPayment(method.id)} // Desabilita alteração durante loading
                                            className="w-4 h-4 text-pink-600 mb-2"
                                            disabled={isLoading} // Desabilita o radio durante loading
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
                                    disabled={isLoading} // Desabilita input durante loading
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
                                    disabled={isLoading} // Desabilita input durante loading
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
                                        disabled={isLoading} // Desabilita input durante loading
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
                                        disabled={isLoading} // Desabilita input durante loading
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
                            disabled={isLoading} // Desabilita o botão durante o loading
                        >
                            {isLoading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Processando...
                                </>
                            ) : (
                                `Confirmar Assinatura - ${selectedPlanData?.price}`
                            )}
                        </button>

                        <p className="text-sm text-gray-500 mt-4">
                            Ao confirmar, você concorda com nossos termos de uso e política de privacidade
                        </p>
                    </div>
                )}
            </div>

            {/* Modal para confirmar troca de plano */}
            <Modal show={showModalTrocaPlano} onHide={() => setShowModalTrocaPlano(false)} centered>
                <div className="registro-header-azul">
                    <Modal.Title className="text-white">Confirmar Troca de Plano</Modal.Title>
                </div>
                <Modal.Body className="py-4">
                    {planToChangeTo && currentSubscription && (
                        <p className="mb-4">
                            Tem certeza que deseja **trocar** do plano **{currentSubscription.plano_nome}** para o plano **{planToChangeTo.title} ({planToChangeTo.price})**?
                        </p>
                    )}
                    <p className="mb-3">Ao confirmar a troca:</p>
                    <ul>
                        <li>Seu novo plano será ativado imediatamente.</li>
                        <li>O valor do novo plano será cobrado na sua próxima fatura.</li>
                        <li>Você terá acesso aos benefícios do novo plano imediatamente.</li>
                    </ul>
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center gap-3 pb-4">
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShowModalTrocaPlano(false)}
                        className="custom-button-outline px-4"
                        disabled={isLoading} // Desabilita botões do modal durante loading
                    >
                        Voltar
                    </Button>
                    <Button
                        onClick={handleConfirmarTrocaPlano}
                        className="custom-button-azul px-4"
                        disabled={isLoading} // Desabilita botões do modal durante loading
                    >
                        {isLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Confirmando...
                            </>
                        ) : (
                            'Confirmar Troca'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AssinaturaPagamento;