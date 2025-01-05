import React from 'react';
import '../CSS_Components/Header.css'; 

const Header = () => {
  return (
    <header className="header">
      {/* Logo a la izquierda */}
      <div className="logo-container">
        <img 
          src="../ImagenesP/Logo1.png" 
          alt="Logo" 
          className="logo-image"
        />
      </div>

      {/* Contenedor derecho para navegación y botones */}
      <div className="right-content">
        {/* Navigation Links */}
        <nav className="nav-links">
          <a href="#inicio">Inicio</a>
          <a href="#articulos">Artículos</a>
          <a href="#ofertas">Ofertas</a>
          <a href="#contactos">Contactos</a>
          <a href="#quienes-somos">Quiénes somos</a>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <button className="login-btn">
            Iniciar Sesión
          </button>
          <button className="register-btn">
            Regístrate
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;