import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Form } from 'react-bootstrap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

const RelatoriosApoiador = () => {
    const { token } = useAuth();
    const [relatoriosData, setRelatoriosData] = useState({ doacoesPorMes: [], doacoesPorCategoria: [] });
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cores = ['#0A7D7E', '#76B5A0', '#B3E0C2', '#5EAAA8', '#A3D2CA'];
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const anosDisponiveis = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => {
        const fetchRelatorios = async () => {
            if (!token) return;
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:8000/apoiador/relatorios?ano=${selectedYear}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRelatoriosData(response.data);
            } catch (err) {
                console.error("Erro ao buscar relatórios:", err);
                setError("Não foi possível carregar os relatórios.");
            } finally {
                setLoading(false);
            }
        };
        fetchRelatorios();
    }, [selectedYear, token]);

    const dadosGraficoBarras = meses.map((mesNome, index) => {
        const mesNumero = index + 1;
        const dadosDoMes = relatoriosData.doacoesPorMes.find(d => d.mes === mesNumero);
        return { name: mesNome, total: dadosDoMes ? parseFloat(dadosDoMes.total) : 0 };
    });

    const dadosGraficoPizza = relatoriosData.doacoesPorCategoria.map(d => ({
        name: d.categoria,
        value: parseFloat(d.total)
    }));

    const renderizaConteudo = () => {
        if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;
        if (error) return <Alert variant="danger" className="text-center">{error}</Alert>;
        const semDados = dadosGraficoBarras.every(d => d.total === 0) && dadosGraficoPizza.length === 0;
        if (semDados) return <Alert variant="info" className="text-center">Nenhuma contribuição encontrada para o ano de {selectedYear}.</Alert>;

        return (
            <div className="row mt-4">
                <div className="col-lg-7 mb-4 mb-lg-0">
                    <h6 className="label-azul text-center">Doações por Mês em {selectedYear}</h6>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dadosGraficoBarras} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `R$${value}`} />
                            <Tooltip formatter={(value) => [`R$${parseFloat(value).toFixed(2)}`, 'Total']} />
                            <Bar dataKey="total" fill="#0A7D7E" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="col-lg-5">
                    <h6 className="label-azul text-center">Distribuição por Categoria</h6>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={dadosGraficoPizza} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {dadosGraficoPizza.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name) => [`R$${parseFloat(value).toFixed(2)}`, name]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    return (
        <Card className="mb-4 shadow-sm p-4">
            <div className="d-flex flex-column align-items-start mb-4">
                <h4 className="label-azul">Relatórios de Contribuição</h4>
                
                {/* ✅ DIV CORRIGIDA COM A LARGURA DE 50% ✅ */}
                <div className="w-50 mt-2">
                    <Form.Select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        aria-label="Selecionar ano"
                    >
                        {anosDisponiveis.map(ano => (
                            <option key={ano} value={ano}>{ano}</option>
                        ))}
                    </Form.Select>
                </div>
            </div>
            
            {renderizaConteudo()}
        </Card>
    );
};

export default RelatoriosApoiador;