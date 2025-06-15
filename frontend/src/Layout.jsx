// src/Layout.jsx

import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar.jsx';
import Footer from './components/footer/Footer.jsx';
import { useAuth } from './context/AuthContext'; 

const NAVBAR_HEIGHT_PX = 60; // <--- CONFIRME A ALTURA REAL DA SUA NAVBAR AQUI (via F12)

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const profilePaths = ['/perfil-aluno', '/perfil', '/perfil-professor', '/perfil-adm']; 
  const shouldHideNavbar = profilePaths.some(path => location.pathname.startsWith(path)) && isAuthenticated() && user && user.role === 'aluno';

  const hideFooterPaths = ['/perfil-aluno', '/perfil', '/perfil-professor', '/perfil-adm']; 
  const shouldHideFooter = hideFooterPaths.some(path => location.pathname.startsWith(path));

  // Aplica padding se a Navbar NÃO for escondida (ou seja, se ela estiver visível)
  const mainPaddingTop = shouldHideNavbar ? '0px' : `${NAVBAR_HEIGHT_PX}px`; 

  return (
    <>
      {!shouldHideNavbar && <Navbar />} 
      
      <main style={{ paddingTop: mainPaddingTop }}> {/* <--- PADDING-TOP APLICADO AQUI */}
        {children}
      </main>
      
      {!shouldHideFooter && <Footer />}
    </>
  );
};

export default Layout;