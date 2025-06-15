import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para que a próxima renderização mostre a UI de fallback.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você também pode registrar o erro em um serviço de relatórios de erro
    console.error("Erro capturado pelo Error Boundary:", error, errorInfo);
    // Exemplo de envio para um serviço de monitoramento:
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI de fallback personalizada
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: 'red', border: '1px solid red' }}>
          <h2>Ops! Algo deu errado.</h2>
          <p>Por favor, tente novamente mais tarde.</p>
          <button onClick={() => window.location.reload()}>Recarregar Página</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;