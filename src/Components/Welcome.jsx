import React from 'react';
import '../CSS_Components/Welcome.css'; 


const Welcome = () => {
  return (
    <section className="welcome-section">
      <div className="welcome-content">
        <h1 className="main-title">Bienvenidos a Poli-Trade</h1>
        <h2 className="subtitle">Comercio dentro de la Escuela Politécnica Nacional</h2>
        
        <div className="description">
          <p>Encuentra todo lo que necesitas dentro de la Escuela Politécnica Nacional:</p>
          <p>desde libros de Inglés hasta gadgets tecnológicos y accesorios esenciales.</p>
        </div>

        <h3 className="discover-text">¡Descubre las mejores ofertas de tus compañeros!</h3>

        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">13k+</span>
            <span className="stat-label">Estudiantes Politécnicos</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">25+</span>
            <span className="stat-label">Carreras</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1962</span>
            <span className="stat-label">Año de Fundación EPN</span>
          </div>
        </div>

        <button className="register-btn">Regístrate</button>
      </div>
    </section>
  );
};

export default Welcome;