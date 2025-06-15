// src/ProtectedRoute.jsx

import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // <--- CORREÇÃO AQUI: de '../context/AuthContext' para './context/AuthContext'

const ProtectedRoute = ({ allowedRoles, publicIfUnauthenticated, children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Logs de depuração (mantenha ou remova conforme a necessidade)
  useEffect(() => {
    console.log("DEBUG [ProtectedRoute]: Renderizado para path:", window.location.pathname);
    console.log("DEBUG [ProtectedRoute]: IsAuthenticated:", isAuthenticated());
    console.log("DEBUG [ProtectedRoute]: User obj:", user);
    console.log("DEBUG [ProtectedRoute]: User Role:", user?.role);
    console.log("DEBUG [ProtectedRoute]: Loading Auth:", loading);
    console.log("DEBUG [ProtectedRoute]: Allowed Roles:", allowedRoles);
  }, [isAuthenticated, user, loading, allowedRoles]);

  // 1. Mostrar carregamento se a autenticação ainda não terminou
  if (loading) {
    return <div>Carregando autenticação...</div>;
  }

  // 2. Se a rota pode ser acessada por não autenticados E o usuário NÃO está autenticado, permite o acesso.
  if (publicIfUnauthenticated && !isAuthenticated()) {
    console.log("DEBUG [ProtectedRoute]: Rota pública para não autenticados. Acesso permitido.");
    return children ? children : <Outlet />;
  }

  // 3. Se não estiver autenticado (e não é uma rota pública para não-logados), redireciona para o login
  if (!isAuthenticated()) {
    console.log("DEBUG [ProtectedRoute]: Não autenticado e não é rota pública para não-logados. Redirecionando para /login.");
    return <Navigate to="/login" replace />;
  }

  // A partir daqui, o usuário ESTÁ AUTENTICADO.
  // 4. Se o user ou user.role não estão definidos (erro no AuthContext?)
  if (!user || !user.role) {
    console.warn("AVISO [ProtectedRoute]: Usuário autenticado mas sem role definida. Redirecionando para login.");
    // Isso pode indicar um problema na busca de perfil no AuthContext
    return <Navigate to="/login" replace />;
  }

  // 5. Se houver roles permitidas, verifica se a role do usuário logado está entre elas
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Se a role do user NÃO está nas allowedRoles, acesso negado
    console.warn(`AVISO [ProtectedRoute]: Acesso negado para role "${user.role}". Redirecionando para /. Roles permitidas: ${allowedRoles.join(", ")}`);
    return <Navigate to="/" replace />;
  }

  // Se passou por todas as verificações, o acesso é PERMITIDO.
  console.log(`DEBUG [ProtectedRoute]: Acesso PERMITIDO para role "${user.role}" para a rota.`);
  return children ? children : <Outlet />;
};

export default ProtectedRoute;