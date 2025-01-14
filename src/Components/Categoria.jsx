import React from 'react';
import Carousel from './carrusel';

const Articulo_carrusel = ({ id, titulo, infoGeneral, procesoCompra, productos }) => {
  return (
    <section className="categoria" id={id}>
      <h2 className="categoria-titulo">{titulo}</h2>

      <div className="info-container">
        {/* Información General */}
        <div className="info-section">
          <h3>Información General</h3>
          <ul>
            {infoGeneral.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Proceso de Compra */}
        <div className="info-section">
          <h3>Proceso de Compra</h3>
          <ul>
            {procesoCompra.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Carrusel de productos */}
      <Carousel productos={productos} />
    </section>
  );
};

export default Articulo_carrusel ;

