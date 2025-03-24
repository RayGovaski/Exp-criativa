import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer.jsx";
import RegistroApoiador from "./RegistroApoiador.jsx";
import RegistroAluno from "./RegistroAluno.jsx";
import MenuRegistro from "./MenuRegistro.jsx";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<MenuRegistro />} />
          <Route path="/registro-apoiador" element={<RegistroApoiador />} />
          <Route path="/registro-aluno" element={<RegistroAluno />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
