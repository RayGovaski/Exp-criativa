//App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer.jsx";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import RegistroApoiador from "./Registros/RegistroApoiador.jsx";
import RegistroAluno from "./Registros/RegistroAluno.jsx";
import MenuRegistro from "./MenuRegistro.jsx";
import Home from "./Home";
import Login from "./Login/Login";
import Perfil from "./Perfil/Perfil";

import "./App.css";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro-apoiador" element={<RegistroApoiador />} />
          <Route path="/registro-aluno" element={<RegistroAluno />} />
          <Route path="/menu-registro" element={<MenuRegistro />} />

           {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/perfil" element={<Perfil />} />
          </Route>
          
          {/* Redirect to login if no route matches */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;