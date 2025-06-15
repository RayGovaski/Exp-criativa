// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const setAxiosAuthHeader = useCallback((authToken) => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      console.log('DEBUG [AuthContext]: Axios header configurado.');
    } else {
      delete axios.defaults.headers.common['Authorization'];
      console.log('DEBUG [AuthContext]: Axios header LIMPO.');
    }
  }, []);

  // --- FUNÇÃO CORRIGIDA: fetchAndSetUserProfile ---
  // Agora recebe APENAS a string do token JWT
  const fetchAndSetUserProfile = useCallback(async (jwtString) => { 
    if (!jwtString || typeof jwtString !== 'string') {
      console.log('DEBUG [AuthContext]: Token inválido (não é string). Limpando sessão.');
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      setAxiosAuthHeader(null);
      return false;
    }

    let decodedUserPayload; // Este será o payload decodificado
    try {
      decodedUserPayload = jwtDecode(jwtString); // <--- Decodifica a string JWT
      console.log('DEBUG [AuthContext]: Token decodificado dentro de fetchAndSetUserProfile:', decodedUserPayload);
    } catch (error) {
      console.error("ERRO [AuthContext]: Falha ao decodificar token JWT dentro de fetchAndSetUserProfile:", error);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      setAxiosAuthHeader(null);
      return false;
    }

    if (!decodedUserPayload.role || !decodedUserPayload.id) {
      console.error('ERRO [AuthContext]: Token decodificado não contém role ou ID. Limpando sessão.');
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      setAxiosAuthHeader(null);
      return false;
    }

    let profileEndpoint = '';
    switch (decodedUserPayload.role) { // Use o payload decodificado para a role
      case 'apoiador':
        profileEndpoint = `http://localhost:8000/apoiador/profile`;
        break;
      case 'aluno':
        profileEndpoint = `http://localhost:8000/alunos/profile`;
        break;
      case 'professor':
        profileEndpoint = `http://localhost:8000/professores/profile`;
        break;
      case 'administrador':
        profileEndpoint = `http://localhost:8000/administrador/profile`;

        break;
      default:
        console.error('ERRO [AuthContext]: Role desconhecida:', decodedUserPayload.role);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        setAxiosAuthHeader(null);
        return false;
    }

    try {
      console.log(`DEBUG [AuthContext]: Buscando perfil para ${decodedUserPayload.role} em: ${profileEndpoint}`);
      setAxiosAuthHeader(jwtString); // Define o cabeçalho com a string JWT
      const response = await axios.get(profileEndpoint, {
        headers: { Authorization: `Bearer ${jwtString}` } // Envia a string JWT
      });
      console.log('DEBUG [AuthContext]: Dados do perfil específicos da role recebidos:', response.data);

      // Combina o payload do token (role, id, email, nome) com os dados do perfil (foto_path, telefone, etc.)
      const fullProfileData = { ...response.data, ...decodedUserPayload }; 
      setUser(fullProfileData);
      setToken(jwtString);
      localStorage.setItem('token', jwtString);
      console.log('DEBUG [AuthContext]: Usuário (perfil completo) setado. Role:', fullProfileData.role);
      return true;
    } catch (error) {
      console.error(`ERRO [AuthContext]: Falha ao buscar perfil de ${decodedUserPayload.role} em ${profileEndpoint}:`, error.response?.status, error.message);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      setAxiosAuthHeader(null);
      return false; 
    }
  }, [setAxiosAuthHeader]);


  // Função decodeAndSetUser (AGORA MAIS SIMPLES, SÓ CHAMA fetchAndSetUserProfile)
  const decodeAndSetUser = useCallback(async (authToken) => { 
    console.log('DEBUG [AuthContext]: decodeAndSetUser acionado. Chamando fetchAndSetUserProfile.');
    return await fetchAndSetUserProfile(authToken); // Apenas repassa a string JWT
  }, [fetchAndSetUserProfile]); // Dependência: fetchAndSetUserProfile


  useEffect(() => {
    console.log('DEBUG [AuthContext]: useEffect de inicialização disparado.');
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      decodeAndSetUser(storedToken);
    }
    setLoading(false);
  }, [decodeAndSetUser]);


  const login = async (email, senha) => {
    console.log('DEBUG [AuthContext]: Iniciando processo de login.');
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/auth/login', { email, senha });
      
      const { token: receivedToken } = response.data; // Apenas pegamos o token aqui, o user virá do fetchAndSetUserProfile
      
      console.log('DEBUG [AuthContext]: Login API sucesso. Token recebido.');
      if (await decodeAndSetUser(receivedToken)) { // Passa A STRING JWT para a função
        console.log('DEBUG [AuthContext]: Login bem-sucedido. Usuário (perfil completo) setado e token armazenado.');
        return { success: true, user: user }; // Retorne o 'user' do estado do contexto
      } else {
        console.log('DEBUG [AuthContext]: Login API sucesso, mas falha ao decodificar/setar token ou buscar perfil.');
        return { success: false, error: "Erro ao processar token de login ou buscar perfil." };
      }
    } catch (error) {
      console.error("ERRO [AuthContext]: Erro de login:", error);
      const errorMessage = error.response?.data?.error || "Credenciais inválidas ou erro de rede.";
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      console.log('DEBUG [AuthContext]: Processo de login finalizado.');
    }
  };

  const logout = useCallback(() => {
    console.log('DEBUG [AuthContext]: Executando LOGOUT. Limpando sessão...');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setAxiosAuthHeader(null);
    console.log('DEBUG [AuthContext]: Sessão limpa. Redirecionando para /login.');
    navigate('/login');
  }, [setAxiosAuthHeader, navigate]);

  const isAuthenticated = () => {
    console.log('DEBUG [AuthContext]: Verificando isAuthenticated. User:', !!user, 'Token:', !!token);
    return !!user && !!token; 
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};