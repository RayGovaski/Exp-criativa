// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoute'; // Importe ProtectedRoute

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ErrorBoundary from './components/ErrorBoundary'; 

import Layout from './Layout.jsx';

import RegistroApoiador from "./pages/Registros/RegistroApoiador.jsx";
import RegistroAluno from "./pages/Registros/RegistroAluno.jsx";
import MenuRegistro from "./pages/menu-registro/MenuRegistro.jsx";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Perfil from "./pages/Perfil/perfil-apoiador/Perfil.jsx"; 
import PaginaDoacoes from "./pages/Pagina-Doacoes/PaginaDoacoes.jsx";
import AssinaturaPagamento from "./pages/compra-assinatura/assinaturapagamento.jsx"; 
import DoacoesPagamento from "./pages/compra-assinatura/DoacoesPagamento.jsx"; 
import PerfilAluno from "./pages/Perfil/perfil-aluno/Perfil-aluno.jsx"; 
import PerfilProfessor from "./pages/Perfil/Perfil-professor/PerfilProfessor.jsx"; 
import RegistroProfessor from "./pages/Registros/RegistroProfessor.jsx";
import GerenciarAssinatura from "./components/comp-perfil-apoiador/gerenciar-assinatura/GerenciarAssinatura.jsx"; 
import PerfilADM from "./pages/Perfil/perfil-ADM/PerfilADM.jsx"; 

const App = () => {
    // Definindo as roles permitidas para páginas que não podem ser acessadas por "aluno"
    // Ou seja, todos menos aluno.
    const nonAlunoRoles = ['apoiador', 'professor', 'administrador']; 

    return (
        <Router>
            <AuthProvider>
                <ErrorBoundary>
                    <Routes>
                        {/* Rotas Públicas (acesso livre, mas doação é um caso especial) */}
                        <Route path="/" element={<Layout><Home /></Layout>} />
                        <Route path="/login" element={<Layout><Login /></Layout>} />
                        <Route path="/registro-apoiador" element={<Layout><RegistroApoiador /></Layout>} />
                        <Route path="/registro-aluno" element={<Layout><RegistroAluno /></Layout>} />
                        <Route path="/registro-professor" element={<Layout><RegistroProfessor /></Layout>} />
                        <Route path="/menu-registro" element={<Layout><MenuRegistro /></Layout>} />
                        
                        {/* Páginas de Doação:
                           - São acessíveis a visitantes (não logados).
                           - São acessíveis a apoiadores, professores, administradores.
                           - NÃO são acessíveis a alunos logados.
                           Para isso, usamos um truque: o ProtectedRoute para nonAlunoRoles,
                           e para não-logados, ele permite acesso via 'allowedRoles' ser vazio.
                        */}
                        <Route 
                            path="/doar" 
                            element={<ProtectedRoute allowedRoles={nonAlunoRoles} publicIfUnauthenticated={true}><Layout><PaginaDoacoes /></Layout></ProtectedRoute>} 
                        />
                        <Route 
                            path="/doar-pagamento" 
                            element={<ProtectedRoute allowedRoles={nonAlunoRoles} publicIfUnauthenticated={true}><Layout><DoacoesPagamento /></Layout></ProtectedRoute>} 
                        />
                        
                        {/* Rotas de Assinatura (APENAS PARA APOIADORES) */}
                        <Route 
                            path="/assinaturas" 
                            element={<ProtectedRoute allowedRoles={['apoiador']}><Layout><AssinaturaPagamento /></Layout></ProtectedRoute>} 
                        />
                        <Route 
                            path="/gerenciar-assinatura" 
                            element={<ProtectedRoute allowedRoles={['apoiador']}><Layout><GerenciarAssinatura /></Layout></ProtectedRoute>} 
                        />

                        {/* Perfis específicos por ROLE */}
                        <Route 
                            path="/perfil" 
                            element={<ProtectedRoute allowedRoles={['apoiador']}><Layout><Perfil /></Layout></ProtectedRoute>} 
                        />
                        <Route 
                            path="/perfil-aluno" 
                            element={<ProtectedRoute allowedRoles={['aluno']}><Layout><PerfilAluno /></Layout></ProtectedRoute>} 
                        />
                        <Route 
                            path="/perfil-professor" 
                            element={<ProtectedRoute allowedRoles={['professor']}><Layout><PerfilProfessor /></Layout></ProtectedRoute>} 
                        />
                        <Route 
                            path="/perfil-adm" 
                            element={<ProtectedRoute allowedRoles={['administrador']}><Layout><PerfilADM /></Layout></ProtectedRoute>} 
                        /> 
                        
                        {/* Rota de redirecionamento final se nenhuma rota casar (para o login) */}
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </ErrorBoundary>
            </AuthProvider>
        </Router>
    );
};

export default App;