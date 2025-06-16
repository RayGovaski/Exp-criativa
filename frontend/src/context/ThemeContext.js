import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Cria o Contexto
const ThemeContext = createContext();

// 2. Função auxiliar para verificar localStorage
function isLocalStorageAvailable() {
  try {
    return typeof window !== 'undefined' && window.localStorage;
  } catch (e) {
    return false;
  }
}

// 3. Função para obter tema salvo
function getSavedTheme() {
  if (isLocalStorageAvailable()) {
    try {
      return localStorage.getItem('theme');
    } catch (e) {
      console.warn('Erro ao acessar localStorage:', e);
      return null;
    }
  }
  return null;
}

// 4. Provedor do Tema
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(function() {
    const savedTheme = getSavedTheme();
    return savedTheme || 'light';
  });

  useEffect(function() {
    // Verifica se estamos no lado cliente
    if (typeof document !== 'undefined') {
      document.body.className = theme + '-mode';
    }
    
    // Salva no localStorage se disponível
    if (isLocalStorageAvailable()) {
      try {
        localStorage.setItem('theme', theme);
      } catch (e) {
        console.warn('Erro ao salvar tema no localStorage:', e);
      }
    }
  }, [theme]);

  function toggleTheme() {
    setTheme(function(prevTheme) {
      return prevTheme === 'light' ? 'dark' : 'light';
    });
  }

  return React.createElement(
    ThemeContext.Provider,
    { value: { theme: theme, toggleTheme: toggleTheme } },
    children
  );
}

// 5. Hook personalizado
function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 6. Exportações
export { ThemeProvider, useTheme };