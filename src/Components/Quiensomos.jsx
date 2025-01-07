import React from 'react';
import '../styles/quiensomos.css';

const Quiensomos = () => {
  return (
    <div className="container">
      <header className="header">
        <h1>¿Quiénes Somos?</h1>
      </header>

      <section className="historia">
        <h2>Nuestra Historia</h2>
        <p>
          Comenzamos en 2024 con la idea de ofrecer soluciones innovadoras en desarrollo de software. Desde entonces, hemos ayudado a numerosas empresas a alcanzar sus objetivos tecnológicos.
        </p>
      </section>

      <section className="mision-vision">
        <div className="mision">
          <h2>MISIÓN</h2>
          <p>
            Facilitar el intercambio y la venta de productos entre los estudiantes de la Escuela Politécnica Nacional, promoviendo una comunidad solidaria, práctica y accesible.
          </p>
          <img src="/ImagenesP/Mision.PNG" alt="Imagen de la misión" />
        </div>
        <div className="vision">
          <h2>VISIÓN</h2>
          <p>
            Ser la plataforma líder en la Escuela Politécnica Nacional para el comercio interno, reconocida por su impacto positivo en la vida estudiantil y su contribución al desarrollo sostenible.
          </p>
          <img src="/ImagenesP/Vision_epn.PNG" alt="Imagen de la visión" />
        </div>
      </section>

      <section className="objetivos">
        <h2>Objetivos</h2>
        <ul>
          <li>Facilitar el comercio interno</li>
          <li>Fomentar la comunidad estudiantil</li>
          <li>Promover el emprendimiento</li>
          <li>Generar ingresos adicionales</li>
        </ul>
      </section>
    </div>
  );
};

export default Quiensomos;
