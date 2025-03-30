import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer.jsx";
import RegistroApoiador from "./RegistroApoiador.jsx";
import RegistroAluno from "./RegistroAluno.jsx";
import MenuRegistro from "./MenuRegistro.jsx";
import Carrossel from "./Carrossel.jsx";  // Importe a página Home
import Home from "./Home"; // Importando o componente Home
import "./App.css";
import Cards from "./Cards.jsx";

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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
