// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

<<<<<<< Updated upstream
  // Check if user is logged in on initial load
=======
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


>>>>>>> Stashed changes
  useEffect(() => {
    const checkLoggedIn = async () => {
      if (token) {
        // Set default authorization header for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        try {
          // Verify the token by fetching user data
          const response = await axios.get('http://localhost:8000/apoiador/profile');
          setUser(response.data);
        } catch (error) {
          // If token is invalid, clear localStorage and state
          console.error("Invalid token:", error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, [token]);

  // Login function
  const login = async (email, senha) => {
    try {
      setLoading(true);
      // 🔧 FIXED: Changed from /login to /auth/login
      const response = await axios.post('http://localhost:8000/auth/login', { email, senha });
      
      const { token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Erro ao fazer login. Tente novamente.";
      
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear state
    setToken(null);
    setUser(null);
    
    // Redirect to login page
    navigate('/login');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token;
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};