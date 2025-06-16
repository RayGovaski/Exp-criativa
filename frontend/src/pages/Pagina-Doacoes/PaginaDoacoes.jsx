import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ProgressBar, Card, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom'; // Importe useLocation
import axios from 'axios';
import '../../components/comp_home/Doacoes.css';

const PaginaDoacoes = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation(); // Hook para acessar a localização atual

    // Função para buscar a lista de doações do backend
    const fetchAllDoacoes = async () => {
        setLoading(true); // Inicia o loading antes de cada fetch
        setError(null);    // Limpa erros anteriores
        try {
            // Adiciona um timestamp à URL para "burlar" o cache do navegador
            // Isso garante que uma nova requisição seja feita cada vez
            const response = await axios.get(`http://localhost:8000/doacoes/todas?_t=${new Date().getTime()}`);
            console.log("DADOS BRUTOS RECEBIDOS DA API:", response.data);

            const formattedDoacoes = response.data.map(doacao => {
                const porcentagem = doacao.porcentagem || 0;
                // 'corTopoClass' não está sendo usada na renderização do Card. Pode ser removida ou usada.
                // let corTopoClass = 'cor-rosa-claro'; 

                const imageUrl = doacao.tem_imagem ? `http://localhost:8000/doacoes/imagem/${doacao.id}` : null;

                return {
                    ...doacao, // Mantém todos os outros dados
                    imagem: imageUrl // Define a URL da imagem corretamente
                };
            });
            setDoacoes(formattedDoacoes);
        } catch (err) {
            console.error("Erro ao buscar todas as doações:", err);
            setError("Não foi possível carregar as doações. Tente novamente mais tarde.");
        } finally {
            setLoading(false); // Finaliza o loading
        }
    };

    useEffect(() => {
        // Dispara a busca de dados sempre que o componente é montado
        // OU quando o path muda (indicando que o usuário navegou para/de outra página)
        // OU quando a rota específica de doações é re-focada.
        // A dependência 'location.key' muda a cada navegação, forçando o useEffect a rodar.
        fetchAllDoacoes();
    }, [location.key]); // <--- ALTERADO: Dependência para recarregar quando a rota muda/é re-visitada

    if (loading) return <Container className="text-center my-4"><p>Carregando...</p></Container>;
    if (error) return <Container className="text-center my-4"><p className="text-danger">{error}</p></Container>;

    return (
        <Container className="doacoes-page-container my-5">
            <Row className="justify-content-center text-center mb-5">
                <Col md={8}>
                    <h1 className="fw-semibold text-danger mb-2">Apoie Nossas Causas</h1>
                    <div className="footer-line2 mx-auto mb-3"></div>
                    <p className="lead fw-semibold text-muted">
                        Cada doação faz a diferença na vida de crianças e jovens,
                        proporcionando acesso à arte, educação e cultura. Escolha uma iniciativa abaixo e contribua!
                    </p>
                </Col>
            </Row>

            <Row className="g-4 justify-content-center">
                {doacoes.map((item) => {
                    // isGoalAchieved agora usa o status retornado do backend
                    const isGoalAchieved = item.status === 'Concluída'; 
                    // O item.porcentagem >= 100 pode ser um indicador visual, 
                    // mas o status 'Concluída' do DB é o mais confiável para a lógica de negócio.
                    // Você pode manter ambos se quiser uma redundância no frontend:
                    // const isGoalAchieved = item.status === 'Concluída' || item.porcentagem >= 100;

                    return (
                        <Col key={item.id} md={6} lg={4} className="d-flex align-items-stretch">
                            <Card className="sombra-card2 card-largo h-100 position-relative">
                                {/* 'item.corTopo' não é definido no formattedDoacoes, então sempre usará 'cor-rosa-claro' */}
                                <div className={`card-top-bar ${item.corTopo || 'cor-rosa-claro'}`}></div>
                                <Card.Img
                                    variant="top"
                                    src={item.imagem || "https://placehold.co/600x400?text=Sem+Imagem"}
                                    className="img-doacao"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400?text=Erro"; }}
                                />
                                <Card.Body className="d-flex flex-column">
                                    <div>
                                        <Card.Title>{item.titulo}</Card.Title>
                                        <Card.Text>{item.descricao}</Card.Text>
                                    </div>
                                    <div className="mt-auto d-flex justify-content-center flex-column align-items-center"> {/* Adicionado flex-column e align-items-center para centralizar ambos*/}
                                        <ProgressBar now={item.porcentagem} label={`${item.porcentagem}%`} className="mb-3 w-100" />
                                        
                                        {isGoalAchieved ? (
                                            <Button
                                                variant="success"
                                                className="w-100 rounded-pill"
                                                disabled
                                            >
                                                Meta Concluída! 🎉
                                            </Button>
                                        ) : (
                                            <Link
                                                to="/doar-pagamento"
                                                state={{ preSelectedCauseId: item.id, preSelectedCauseTitle: item.titulo }}
                                                className="btn botao-rosa-claro w-50"
                                            >
                                                Doar
                                            </Link>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </Container>
    );
};

export default PaginaDoacoes;