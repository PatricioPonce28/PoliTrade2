import React from 'react'
import { Link } from 'react-router-dom'
import '../CSS_Components/Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img
          src="../ImagenesP/Logo1.png"
          alt="Logo"
          className="logo-image"
        />
      </div>

      <div className="right-content">
        <nav className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/articulos">Artículos</Link>
          <Link to="/ofertas">Ofertas</Link>
          <Link to="/contactos">Contactos</Link>
          <Link to="/quienes-somos">Quiénes somos</Link>
        </nav>

        <div className="auth-buttons">
          <Link to="/login" className="login-btn">
            Iniciar Sesión
          </Link>
          <Link to="/registro" className="register-btn">
            Regístrate
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header