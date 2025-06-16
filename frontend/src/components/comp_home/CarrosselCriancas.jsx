import React, { useState, useEffect } from 'react';
import "./CarrosselCriancas.css"; 

const CarrosselCriancas = () => {
  const criancas = [
    {
      nome: "Lucas",
      idade: 11,
      foto: "src/Assets/FotoLucas.png",
      descricao: "Desde que comecei as aulas, aprendi a tocar violão e fiz muitos amigos! Agora sonho em ser músico."
    },
    {
      nome: "Ana",
      idade: 9,
      foto: "src/Assets/FotoAna.png",
      descricao: "Eu adoro o teatro! Toda vez que subo no palco, fico muito feliz e quero fazer de novo"
    },
    {
      nome: "Sofia",
      idade: 12,
      foto: "src/Assets/FotoSofia.png",
      descricao: "Antes eu era muito tímida, mas agora adoro cantar e me apresentar para os meus amigos!"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % criancas.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [criancas.length]);

  return (
    <div className="fundo-carrossel">
  <div className="container-carrossel">
    <h1 className="titulo-carrossel">Vozes do Amanhã</h1>
    <div className="divisoria"></div>
    <p className="subtitulo-carrossel1">
      Histórias que inspiram e transformam!
    </p>
    <p className="subtitulo-carrossel">
      Aqui, você conhece algumas das crianças que fazem parte do projeto e vê como a arte e a cultura estão mudando suas vidas!
    </p>

    <div className="mt-4">
      <img
        src={criancas[currentIndex].foto}
        alt={`Foto de ${criancas[currentIndex].nome}`}
        className="foto-crianca"
      />
      <h2 className="nome-crianca">{criancas[currentIndex].nome}</h2>
      <p className="idade-crianca">{criancas[currentIndex].idade} anos</p>
      <p className="descricao-crianca">{criancas[currentIndex].descricao}</p>

      <div className="paginacao-carrossel mt-4">
        {criancas.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={index === currentIndex ? "active" : ""}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  </div>
</div>

  );
};

export default CarrosselCriancas;
