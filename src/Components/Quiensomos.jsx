import React from 'react';
import '../CSS_Components/Quiensomos.css';

const Quiensomos = () => {
  return (
    <div className="quienes-somos-container">
      <div className="content-wrapper">
        <header className="quienes-header">
          <h1>¿Quiénes Somos?</h1>
        </header>

        <section className="mision-vision">
          <div className="mision">
            <h2>MISIÓN</h2>
            <p>
              Facilitar el intercambio y la venta de productos entre los estudiantes 
              de la Escuela Politécnica Nacional, promoviendo una comunidad solidaria, 
              práctica y accesible.
            </p>
            <img src="/ImagenesP/Mision.PNG" alt="Búho" className="mascot-image" />
          </div>
          <div className="vision">
            <h2>VISIÓN</h2>
            <p>
              Ser la plataforma líder en la Escuela Politécnica Nacional para el 
              comercio interno, reconocida por su impacto positivo en la vida 
              estudiantil y su contribución al desarrollo sostenible.
            </p>
            <img src="/ImagenesP/Vision_epn.PNG" alt="Robot" className="mascot-image" />
          </div>
        </section>

        <section className="objetivos">
          <h2>Objetivos</h2>
          <div className="objetivos-lista">
            <div className="objetivo-item">
              <span className="objetivo-icon">🔄</span>
              <p>Facilitar el comercio interno</p>
            </div>
            <div className="objetivo-item">
              <span className="objetivo-icon">👥</span>
              <p>Fomentar la comunidad estudiantil</p>
            </div>
            <div className="objetivo-item">
              <span className="objetivo-icon">💡</span>
              <p>Promover el emprendimiento</p>
            </div>
            <div className="objetivo-item">
              <span className="objetivo-icon">💰</span>
              <p>Generar ingresos adicionales</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Quiensomos;
