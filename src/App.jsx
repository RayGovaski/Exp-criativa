import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer.jsx";
import RegistroApoiador from "./Registros/RegistroApoiador.jsx";
import RegistroAluno from "./Registros/RegistroAluno.jsx";
import MenuRegistro from "./MenuRegistro.jsx";
import AdministraAlunos from "./Administrador/AdministraAlunos";
import Home from "./Home"; // Importando o componente Home
import "./App.css";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} /> {/* A rota para a página Home */}
          <Route path="/registro-apoiador" element={<RegistroApoiador />} />
          <Route path="/registro-aluno" element={<RegistroAluno />} />
          <Route path="/menu-registro" element={<MenuRegistro />} />
          <Route path="/administrador" element={<AdministraAlunos />}></Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
