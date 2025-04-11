import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer.jsx";
import RegistroApoiador from "./Registros/RegistroApoiador.jsx";
import RegistroAluno from "./Registros/RegistroAluno.jsx";
import MenuRegistro from "./MenuRegistro.jsx";
import AdministraAlunos from "./Administrador/AdministraAlunos";
import AdministraApoiador from "./Administrador/AdministraApoiador";
import Home from "./Home";
import Login from "./Login/Login";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div>
        {/*<SVGFilters /> {/* Adiciona os filtros SVG ao DOM <Preloader />*/}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro-apoiador" element={<RegistroApoiador />} />
          <Route path="/registro-aluno" element={<RegistroAluno />} />
          <Route path="/menu-registro" element={<MenuRegistro />} />
          <Route path="/adm-apoiador" element={<AdministraApoiador />} />
          <Route path="/adm-aluno" element={<AdministraAlunos />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;