// src/Layout.jsx

import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar.jsx';
import Footer from './components/footer/Footer.jsx';
import { useAuth } from './context/AuthContext'; 

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const NAVBAR_HEIGHT_PX = 60;

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const profilePaths = ['/perfil-aluno', '/perfil', '/perfil-professor', '/perfil-adm']; 
  const shouldHideNavbar = profilePaths.some(path => location.pathname.startsWith(path)) &&
                         isAuthenticated() &&
                         user &&
                         (user.role === 'aluno' || user.role === 'professor');

  const hideFooterPaths = ['/perfil-aluno', '/perfil', '/perfil-professor', '/perfil-adm']; 
  const shouldHideFooter = hideFooterPaths.some(path => location.pathname.startsWith(path));

  const mainPaddingTop = shouldHideNavbar ? '0px' : `${NAVBAR_HEIGHT_PX}px`; 

  return (
    <>
      {!shouldHideNavbar && <Navbar />} 
      
      <main style={{ paddingTop: mainPaddingTop }}> 
        {children}
      </main>
      
      {!shouldHideFooter && <Footer />}
      <ToastContainer />

    </>
  );
};

export default Layout;