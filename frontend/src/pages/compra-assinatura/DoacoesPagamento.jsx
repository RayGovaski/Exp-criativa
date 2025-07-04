import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, FileText } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import "./DoacoesPagamento.css";
import { ProgressBar } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const paymentMethods = [
    { id: 'Credito', name: 'Cartão de Crédito', icon: CreditCard },
    { id: 'Debito', name: 'Cartão de Débito', icon: CreditCard },
    { id: 'Pix', name: 'Pix', icon: Smartphone },
    { id: 'Boleto', name: 'Boleto', icon: FileText }
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
    const [isLoading, setIsLoading] = useState(false); // Adicionado estado de loading

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (!preSelectedCauseId) {
                setProjectError("Nenhum projeto de doação selecionado. Redirecionando...");
                // Usando toast para esta mensagem também para consistência
                toast.error("Nenhum projeto de doação selecionado. Redirecionando...", { autoClose: 6000, toastId: 'noProject' });
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8000/doacoes/${preSelectedCauseId}`);
                setSelectedProjectData(response.data);
            } catch (err) {
                console.error("Erro ao buscar detalhes do projeto:", err);
                setProjectError("Erro ao carregar detalhes do projeto. Tente novamente.");
                toast.error("Erro ao carregar detalhes do projeto. Tente novamente.", { toastId: 'projectLoadError' });
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

    const handleCardInputChange = (field, value) => {
        setCustomerData(prev => ({ ...prev, [field]: value }));
    };


    const handleDonate = async () => {
        setIsLoading(true); // Inicia o loading
        toast.dismiss(); // Limpa toasts anteriores para evitar confusão

        // Validações iniciais (frontend)
        if (!donationAmount || parseFloat(donationAmount) <= 0 || !preSelectedCauseId || !selectedPayment) {
            toast.error('Por favor, insira um valor de doação válido e selecione um método de pagamento.');
            setIsLoading(false); // Para o loading em caso de erro
            return;
        }

        const valorNumerico = parseFloat(donationAmount);

        // Ajuste: Prefira verificar se customerData.name é uma string não vazia ou nula, etc.
        // Se user está autenticado, não precisa de dados do formulário de cliente
        // Caso contrário, todos os 3 campos são obrigatórios para não-autenticados
        if (!isAuthenticated() && (!customerData.name || customerData.name.trim() === '' ||
                                  !customerData.email || customerData.email.trim() === '' ||
                                  !customerData.phone || customerData.phone.trim() === '')) {
            toast.error('Por favor, preencha todos os seus dados (Nome, Email, Telefone) para continuar.');
            setIsLoading(false);
            return;
        }

        if ((selectedPayment === 'Credito' || selectedPayment === 'Debito') &&
            (!customerData.cardNumber || customerData.cardNumber.trim() === '' ||
             !customerData.cardName || customerData.cardName.trim() === '' ||
             !customerData.cardExpiry || customerData.cardExpiry.trim() === '' ||
             !customerData.cardCvv || customerData.cardCvv.trim() === '')) {
            toast.error('Por favor, preencha todos os dados do cartão.');
            setIsLoading(false);
            return;
        }

        toast.info("Processando sua doação...", { autoClose: false, closeButton: false, toastId: 'donationProcess' }); // Toast de processamento

        const donationPayload = {
            doacaoId: preSelectedCauseId,
            valorDoado: valorNumerico,
            formaPagamento: selectedPayment,
            ...(isAuthenticated() ? {} : {
                customerName: customerData.name,
                customerEmail: customerData.email,
                customerPhone: customerData.phone,
            }),
            ...(selectedPayment === 'Credito' || selectedPayment === 'Debito' ? {
                cardNumber: customerData.cardNumber,
                cardName: customerData.cardName,
                cardExpiry: customerData.cardExpiry,
                cardCvv: customerData.cardCvv
            } : {}),
        };

        try {
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            console.log("Enviando payload da doação:", donationPayload); // Log para depuração
            const response = await axios.post('http://localhost:8000/doacoes/processar', donationPayload, { headers });
            console.log("Resposta da doação:", response.data); // Log para depuração

            toast.dismiss('donationProcess'); // Remove o toast de processamento
            toast.success(response.data.message || 'Doação realizada com sucesso!');

            // ✅ Atrasar a navegação para que o toast seja visível
            setTimeout(() => {
                navigate('/doar');
            }, 6000); // 1.5 segundos para o usuário ver o toast

        } catch (error) {
            console.error("Erro ao processar doação:", error);
            toast.dismiss('donationProcess'); // Remove o toast de processamento

            let errorMessage = "Ocorreu um erro ao processar sua doação. Tente novamente.";
            if (error.response && error.response.data) {
                // Tenta pegar a mensagem de erro mais específica do backend
                if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else {
                    errorMessage = `Erro do servidor: ${error.response.status} - ${error.response.statusText || 'Mensagem desconhecida'}`;
                }
            } else if (error.message) {
                errorMessage = error.message; // Captura a mensagem do AxiosError
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false); // Finaliza o loading, independentemente do sucesso ou erro
        }
    };

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

                        <div className="mb-4">
                            <p><strong>Projeto:</strong> {selectedProjectData.titulo}</p>
                            <p><strong>Descrição:</strong> {selectedProjectData.descricao}</p>
                            <p><strong>Meta:</strong> R$ {selectedProjectData.valorMeta.toFixed(2).replace('.', ',')}</p>
                            <p><strong>Arrecadado:</strong> R$ {selectedProjectData.arrecadado.toFixed(2).replace('.', ',')}</p>
                            <p><strong>Status:</strong> {selectedProjectData.status}</p>
                            <p><strong>Período:</strong> {selectedProjectData.dataInicio ? new Date(selectedProjectData.dataInicio).toLocaleDateString('pt-BR') : 'N/A'} a {selectedProjectData.dataFim ? new Date(selectedProjectData.dataFim).toLocaleDateString('pt-BR') : 'N/A'}</p>
                            <p><strong>Categoria:</strong> {selectedProjectData.categoria}</p>
                            <p><strong>Prioridade:</strong> {selectedProjectData.prioridade}</p>
                        </div>

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
                            disabled={isLoading} // Desabilita input durante loading
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
                                        className={`payment-method-card ${
                                            selectedPayment === method.id ? 'selected' : ''
                                        } relative`}
                                        onClick={() => !isLoading && setSelectedPayment(method.id)} // Desabilita clique durante loading
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
                                    disabled={isLoading} // Desabilita input durante loading
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
                                    disabled={isLoading} // Desabilita input durante loading
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
                                    disabled={isLoading} // Desabilita input durante loading
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Conditional Payment Details Forms */}
                {selectedPayment && (selectedPayment === 'Credito' || selectedPayment === 'Debito') && (
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
                                    value={customerData.cardNumber}
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
                                    value={customerData.cardName}
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
                                        value={customerData.cardExpiry}
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
                                        value={customerData.cardCvv}
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

                {selectedPayment === 'Pix' && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
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

                {selectedPayment === 'Boleto' && (
                    <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
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


                {/* Action Button */}
                {donationAmount && parseFloat(donationAmount) > 0 && selectedPayment && (
                    <div className="text-center">
                        <button
                            onClick={handleDonate}
                            className="confirm-button"
                            disabled={isLoading} // Desabilita o botão durante o loading
                        >
                            {isLoading ? (
                                <>
                                    {/* Spinner de Bootstrap, certifique-se que o CSS do Bootstrap está carregado */}
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Processando...
                                </>
                            ) : (
                                `Confirmar Doação - R$ ${parseFloat(donationAmount).toFixed(2).replace('.', ',')}`
                            )}
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