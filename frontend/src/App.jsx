// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/footer/Footer.jsx";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Importa os componentes do react-toastify
import { ToastContainer } from 'react-toastify';
// Importa o CSS do react-toastify
import 'react-toastify/dist/ReactToastify.css';

// Importa o ErrorBoundary
import ErrorBoundary from './components/ErrorBoundary'; // Supondo que você crie este arquivo

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
import "./App.css";
import PerfilADM from "./pages/Perfil/perfil-ADM/PerfilADM.jsx";

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                {/* Envolvendo as Routes com o ErrorBoundary */}
                <ErrorBoundary>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro-apoiador" element={<RegistroApoiador />} />
                        <Route path="/registro-aluno" element={<RegistroAluno />} />
                        <Route path="/registro-professor" element={<RegistroProfessor />} />
                        <Route path="/menu-registro" element={<MenuRegistro />} />
                        <Route path="/doar" element={<PaginaDoacoes />} />
                        <Route path="/assinaturas" element={<AssinaturaPagamento />} />
                        <Route path="/doar-pagamento" element={<DoacoesPagamento />} />
                        
                        {/* Protected routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/perfil" element={<Perfil />} />
                            <Route path="/perfil-aluno" element={<PerfilAluno />} />
                            <Route path="/perfil-professor" element={<PerfilProfessor />} />
                            <Route path="/perfil-ADM" element={<PerfilADM />} />
                        </Route>

                        {/* Redirect to login if no route matches */}
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </ErrorBoundary>
                <Footer />
                <ToastContainer />
            </AuthProvider>
        </Router>
    );
};

export default App;