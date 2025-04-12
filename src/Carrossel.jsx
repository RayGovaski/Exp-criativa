import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Carrossel.css";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

const Carrossel = () => {
    return (
        <Carousel className="w-100 mx-auto" interval={3000} controls={true} indicators={true}>
            {/* Primeiro Slide */}
            <Carousel.Item>
                <img src="src/Assets/CarrosselPrincipal.png" className="d-block w-100" alt="Imagem 1" />
                <Carousel.Caption>
                    <div className="caption-content">
                        <h2 className="caption-title">Transformando sonhos<br />em realidade através da cultura.</h2>
                        <p className="caption-text">
                            Aulas de música, teatro e muito mais para adolescentes e crianças em situação de vulnerabilidade social.<br />
                            Junte-se a nós nessa missão!
                        </p>
                        <div className="buttons-container">
                            <button className="custom-button-azul3">Quero contribuir</button>
                            <button className="custom-button-azul3">Saber mais</button>
                        </div>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>

            {/* Segundo Slide (com novo estilo) */}
            <Carousel.Item>
                <img src="src/Assets/CarrosselPrincipal2.png" className="d-block w-100" alt="Imagem 2" />
                <Carousel.Caption>
                    <div className="caption-content">
                        <h2 className="caption-title">Junte-se à Nossa Aventura!</h2>
                        <p className="caption-text">
                            Curtiu as nossas aulas e quer se divertir com a gente?<br />
                            Inscreva-se aqui e venha aprender brincando!
                        </p>
                        <div className="buttons-container">
                            <Link to="/menu-registro" className="custom-button-rosa3">
                                Inscreva-se
                            </Link>
                        </div>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
};

export default Carrossel;
