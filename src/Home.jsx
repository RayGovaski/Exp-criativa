import React from "react";
import Carrossel from "./Carrossel";
import Cards from "./Cards";
import "./Home.css"; // Arquivo CSS com os ajustes
import LayoutHome from "./LayoutHome";

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
    </div>
  );
};

export default Home;
