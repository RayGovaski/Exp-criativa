import React from "react";
import "./Cards.css"; 
import "bootstrap/dist/css/bootstrap.min.css";

const cardsData = [
  { id: 1, percent: "98%", text: "dos alunos estão felizes com as aulas!", color: "bg-teal" },
  { id: 2, percent: "100%", text: "de participação nas nossas aulas semanais!", color: "bg-red" },
  { id: 3, percent: "85%", text: "dos alunos melhoraram suas habilidades artísticas desde que começaram!", color: "bg-teal" },
  { id: 4, percent: "92%", text: "das crianças continuam participando das atividades após o primeiro mês!", color: "bg-red" },
];

const Cards = () => {
  return (
    <div className="container py-4">
      <div className="row g-4 cards-grid">
        {cardsData.map((card) => (
          <div key={card.id} className="col-6 col-lg-3 custom-col d-flex justify-content-center">
            <div className="card sombra-card text-center" style={{ width: "250px", borderRadius: "20px", overflow: "hidden", border: "none" }}>
              <div className={`top ${card.color}`} style={{ height: "40px" }}></div>
              <div className="card-body">
                <h2 className="fw-bold">{card.percent}</h2>
                <p className="text-muted">{card.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
