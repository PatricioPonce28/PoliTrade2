import React from 'react';
import '../CSS_Components/Location.css';

const Location = () => {
  return (
    <section className="location-section">
      <div className="location-container">
        <h2 className="location-title">Nuestra Ubicación</h2>
        
        <div className="location-content">
          <div className="location-info">
            <div className="info-card">
              <i className="fas fa-map-marker-alt"></i>
              <h3>Dirección</h3>
              <p>Ladrón de Guevara E11-253, Quito 170517</p>
              <p>Escuela Politécnica Nacional</p>
            </div>

            <div className="info-card">
              <i className="fas fa-clock"></i>
              <h3>Horario de Atención</h3>
              <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
              <p>Sábados: 9:00 AM - 1:00 PM</p>
            </div>

          </div>

          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7967116989087!2d-78.49091572412696!3d-0.2105052998451446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d59bd95d090d31%3A0x24b8d3b90a981d22!2sEscuela%20Polit%C3%A9cnica%20Nacional!5e0!3m2!1ses!2sec!4v1704494646044!5m2!1ses!2sec"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;