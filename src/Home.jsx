import React from "react";
import Carrossel from "./Carrossel";
import Cards from "./Home/Cards";
import "./Home.css"; // Arquivo CSS com os ajustes
import LayoutHome from "./Home/LayoutHome";
import Sobre from "./Home/Sobre";


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
    </div>
  );
};

export default Home;
