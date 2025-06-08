import React from "react";
import Carrossel from "../../components/carrossel/Carrossel";
import Cards from "../../components/comp_home/Cards";
import "./Home.css";
import LayoutHome from "../../components/comp_home/LayoutHome";
import Sobre from "../../components/comp_home/Sobre";
import CardAssinaturas from "../../components/comp_home/CardAssinaturas";
import Perguntas from "../../components/comp_home/Perguntas"
import CarrosselCriancas from "../../components/comp_home/CarrosselCriancas"
import Doacoes from "../../components/comp_home/Doacoes";
import Contato from "../../components/comp_home/Contato";


const Home = () => {
  return (
    <div className="home-container">
      <div className="carrossel-container">
        <Carrossel />
      </div>
      <div className="cards-container">
        <Cards />
      </div>
      <LayoutHome />
      <Sobre />
      <CardAssinaturas />
      <Perguntas />
      <CarrosselCriancas />
      <Doacoes />
      <Contato /> 
    </div>
  );
};

export default Home;
