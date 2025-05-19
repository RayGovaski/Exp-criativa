function ApoiadorFotoPerfil({ apoiadorId, className = "profile-image" }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    // Usar diretamente a URL da API
    const url = `http://localhost:8000/apoiador/foto/${apoiadorId}`;
    setImageUrl(url);
  }, [apoiadorId]);
  
  const handleError = () => {
    setError(true);
  };
  
  return (
    <>
      {!error && imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Foto do perfil" 
          className={className}
          onError={handleError}
        />
      ) : (
        // Imagem padrão para quando não há foto ou ocorreu um erro
        <div className={`${className} default-avatar`}>
          {/* Você pode usar um ícone ou texto aqui */}
          <span>Sem Foto</span>
        </div>
      )}
    </>
  );
}

export default ApoiadorFotoPerfil;