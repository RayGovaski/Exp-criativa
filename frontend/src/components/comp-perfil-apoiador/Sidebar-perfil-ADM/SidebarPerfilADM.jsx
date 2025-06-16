// SidebarPerfilADM.jsx
import React from "react";
import { ListGroup, Nav } from "react-bootstrap";
import {
  MdDashboard, // For Relatórios
  MdGroupAdd,   // For Criar Turma
  MdAddBox,     // For Criar Card Doação
  MdPeople,     // For Criar Perfil Professor
  MdDeleteForever, // For Deletar Conta
  MdMenu,       // Hamburger icon for mobile menu
  MdClose       // Close icon for mobile menu
} from "react-icons/md";

// IMPORTANT: Ensure this CSS file (Sidebar-perfil-adm.css) is in the SAME DIRECTORY
// as this SidebarPerfilADM.jsx file.
import './Sidebar-perfil-adm.css';

const SidebarPerfilADM = ({ setSecaoAtiva, secaoAtiva, isMobileOpen, toggleMobileMenu }) => {
  const handleNavigation = (section) => {
    setSecaoAtiva(section);
    // Close the mobile menu if it's open and on a mobile device
    if (window.innerWidth < 768) {
      toggleMobileMenu();
    }
  };

  return (
    <>
      {/* Hamburger menu button - visible only on mobile */}
      <div className="hamburger-menu-adm d-md-none">
        <button
          className="hamburger-button-adm"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
        </button>
      </div>

      {/* Sidebar container - always visible on desktop, conditionally visible on mobile */}
      <div className={`sidebar-perfil-adm ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Close button for mobile sidebar */}
        <div className="d-flex d-md-none justify-content-end w-100 p-2">
          <button className="close-button-adm" onClick={toggleMobileMenu}>
            <MdClose size={24} />
          </button>
        </div>

        {/* Admin profile section at the top of the sidebar */}
        <div className="profile-section-sidebar-adm d-flex flex-column align-items-center mb-4 mt-3">
          <img
            src="https://placehold.co/80x80/0A7D7E/ffffff?text=ADM"
            alt="Admin Profile"
            className="rounded-circle mb-2"
            style={{ width: "80px", height: "80px", objectFit: "cover", border: "3px solid rgba(255, 255, 255, 0.8)" }}
          />
          <h5 className="text-white mb-0">Admin User</h5>
          <p className="text-muted-custom-adm">Administrador</p>
        </div>

        {/* Navigation links */}
        <ListGroup variant="flush" className="sidebar-links-adm">
          <ListGroup.Item
            action
            onClick={() => handleNavigation("relatorios")}
            active={secaoAtiva === "relatorios"}
            className="sidebar-item-adm"
          >
            <Nav.Link className="d-flex align-items-center">
              <MdDashboard className="me-2" size={20} /> Relatórios
            </Nav.Link>
          </ListGroup.Item>

          <ListGroup.Item
            action
            onClick={() => handleNavigation("criarTurma")}
            active={secaoAtiva === "criarTurma"}
            className="sidebar-item-adm"
          >
            <Nav.Link className="d-flex align-items-center">
              <MdGroupAdd className="me-2" size={20} /> Criar Turma
            </Nav.Link>
          </ListGroup.Item>

          <ListGroup.Item
            action
            onClick={() => handleNavigation("criarDoacao")}
            active={secaoAtiva === "criarDoacao"}
            className="sidebar-item-adm"
          >
            <Nav.Link className="d-flex align-items-center">
              <MdAddBox className="me-2" size={20} /> Criar Card Doação
            </Nav.Link>
          </ListGroup.Item>

          <ListGroup.Item
            action
            onClick={() => handleNavigation("criarProfessor")}
            active={secaoAtiva === "criarProfessor"}
            className="sidebar-item-adm"
          >
            <Nav.Link className="d-flex align-items-center">
              <MdPeople className="me-2" size={20} /> Criar Perfil Professor
            </Nav.Link>
          </ListGroup.Item>
        </ListGroup>
      </div>

      {/* Overlay to close the menu when clicking outside (only visible on mobile when menu is open) */}
      {isMobileOpen && (
        <div className="sidebar-overlay-adm d-md-none" onClick={toggleMobileMenu}></div>
      )}
    </>
  );
};

export default SidebarPerfilADM;
