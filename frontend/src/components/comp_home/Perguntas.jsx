import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Perguntas.css";


const Pergunta = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const faqData = [
    {
      question: "1. Como minha doação é utilizada?",
      answer: "Todas as doações são destinadas à compra de materiais, instrumentos musicais, figurinos, manutenção do espaço e ampliação do projeto, garantindo que mais crianças possam participar das atividades."
    },
    {
      question: "2. Quem pode participar das aulas?",
      answer: "Crianças e adolescentes de 6 a 17 anos podem participar das aulas. Não é necessário ter experiência prévia com teatro ou música, apenas interesse em aprender e participar."
    },
    {
      question: "3. Como posso ajudar além das doações?",
      answer: "Você pode ajudar sendo voluntário nas aulas, apoiando na organização de eventos, divulgando o projeto nas redes sociais ou oferecendo serviços profissionais como fotografia, design gráfico, entre outros."
    },
    {
      question: "4. Como posso inscrever uma criança no projeto?",
      answer: "Para inscrever uma criança, preencha o formulário disponível em nosso site ou visite nossa sede. As inscrições são abertas no início de cada semestre, mas temos uma lista de espera para vagas que surgem durante o ano."
    }
  ];

  return (
    <div className="container mt-5 faq-custom">
      <div className="row">
        <div className="col-lg-7">
          <div className="faq-section">
            <h2 className="mb-1 corTitulo faq-title ">Perguntas frequentes</h2>
            <div className="faq-divider mb-5"></div>

            <div className="accordion">
              {faqData.map((item, index) => (
                <div key={index} className="card border-0 mb-2">
                  <div
                    className={`card-header faq-question ${activeQuestion === index ? 'active' : ''}`}
                    onClick={() => toggleQuestion(index)}
                  >
                    <h5 className="mb-0 fs-6 faq-question-text">{item.question}</h5>
                    <span>
                      {activeQuestion === index ? 
                        <i className="bi bi-chevron-up"></i> : 
                        <i className="bi bi-chevron-down"></i>
                      }
                    </span>
                  </div>

                  <div className={`faq-answer collapse ${activeQuestion === index ? 'show' : ''}`}>
                    <div className="card-body faq-answer-text">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-5 d-none d-lg-flex">
          <div className="w-100 d-flex justify-content-center align-items-center imagem-wrapper">
            <img 
              src="src\\Assets\\Crianças.png" 
              alt="Crianças em atividade teatral" 
              className="img-fluid imagem-faq"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pergunta;
