  import React from "react";
  import "bootstrap/dist/css/bootstrap.min.css";
  import "./CardAssinaturas.css";

  const plans = [
    {
      title: "Plano Semente",
      subtitle: "(Toda ajuda faz a diferença!)",
      price: "R$ 20/mês",
      features: [
        "Comprar materiais básicos para as aulas",
        "Apoiar a manutenção do projeto"
      ],
      description:
        "Com o Plano Semente, você planta esperança no futuro de muitas crianças! Sua doação ajuda a fornecer materiais essenciais para as aulas e garante a continuidade do nosso projeto.",
      color: "bg-azul",
      buttonStyle: "botao-assinaturas-primeiro"
    },
    {
      title: "Plano Melodia",
      subtitle: "(Dando voz ao futuro!)",
      price: "R$ 50/mês",
      features: [
        "Comprar e manter instrumentos musicais",
        "Financiar mais aulas para as crianças"
      ],
      description:
        "O Plano Melodia fortalece o ensino da música, garantindo que mais crianças tenham acesso a instrumentos e aulas, trazendo experiências que transformam vidas e abrem novas possibilidades no futuro!",
      color: "bg-azul-claro",
      buttonStyle: "botao-assinaturas-segundo"
    },
    {
      title: "Plano Palco",
      subtitle: "(A arte que muda vidas!)",
      price: "R$ 100/mês",
      features: [
        "Fornecer figurinos e materiais para apresentações",
        "Expandir o alcance do projeto para mais crianças"
      ],
      description:
        "O Plano Palco apoia o desenvolvimento artístico das crianças, ajudando a criar momentos inesquecíveis e dando mais oportunidades para que elas brilhem no palco e na vida!",
      color: "bg-azul",
      buttonStyle: "botao-assinaturas-primeiro"
    },
    {
      title: "Plano Estrela",
      subtitle: "(Transformando futuros!)",
      price: "R$ 200/mês",
      features: [
        "Ajuda a financiar bolsas integrais para alunos",
        "Manter e expandir todas as atividades do projeto"
      ],
      description:
        "O Plano Estrela apoia o desenvolvimento artístico das crianças, ajudando a criar momentos inesquecíveis e dando mais oportunidades para que elas brilhem no palco e na vida!",
      color: "bg-azul-claro",
      buttonStyle: "botao-assinaturas-segundo"
    },
  ];

  const SubscriptionPlans = () => {
    return (
      <div className="container my-5">
        <div className="titulo-container">
          <h2 className="text-center mb-4 sobre-titulo3">Assinaturas</h2>
        </div>
        <div className="row pb-2 equal-height ">
          {plans.map((plan, index) => (
            <div className="col-md-6 col-lg-3 d-flex mudarTamanho" key={index}>
              <div className="card text-center border-0 subscription-card w-100 d-flex flex-column">
                <div className={`top ${plan.color}`} style={{ height: "40px" }}></div>
                <div className="card-body d-flex flex-column">
                  <h5 className=" titulo">{plan.title}</h5>
                  <small className="text-muted subTitulo">{plan.subtitle}</small>
                  <h4 className="preco">{plan.price}</h4>
                  <ul className="list-unstyled flex-grow-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-start text-gray-700">
                      <img src="./src/Assets/check.png" alt="Check" className="tamanho2" />
                      <span className="font-medium">{feature}</span>
                    </li>
                    ))}
                  </ul>
                  <p className="small text-muted flex-grow-1">{plan.description}</p>
                  <div className="mt-auto">
                    <button className={plan.buttonStyle}>Assinar</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default SubscriptionPlans;